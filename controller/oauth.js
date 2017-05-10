const userDao = require('../dao/user'),
    appDao = require('../dao/app'),
    tokenDao = require('../dao/token'),
    tokenRedisDao = require('../dao/redis/token'),
    passport = require('../service/passport'),
    tokenService = require('../service/token'),
    STATUS = require('../common/const').STATUS,
    ERROR = require('../common/error.map');
var signin = async function(ctx, next) {
    var body = ctx.request.body;
    var app = ctx.get('app');
    var user = await userDao.findUserByMobile(body.mobile);
    if (!user || !user.apps || user.apps.length === 0 || user.apps.indexOf(app) === -1) {
        throw ERROR.USER.NOT_EXIST;
    }
    var appInfo = await appDao.find(app, user._id);
    if (!appInfo || !appInfo.password) {
        throw ERROR.USER.NOT_EXIST;
    }
    if (appInfo.status !== STATUS.USER.ACTIVE) {
        throw ERROR.USER.NOT_ACTIVE;
    }
    var result = await passport.validate(body.password, appInfo.password);
    if (!result) {
        throw ERROR.OAUTH.PASSWORD_ERROR;
    }
    ctx.user = user;
    ctx.logger.info(`用户 ${body.mobile} 登录app ${app}`);
    await next();
    appDao.updateLoginAt(appInfo._id);
};
var grantToken = async function(ctx, next) {
    var app = ctx.get('app');
    var tokenInfo = tokenService.grantToken();
    var expiredToken = await tokenDao.getToken(app, ctx.user._id);
    if (expiredToken) {
        tokenRedisDao.delToken(expiredToken.access_token);
        tokenRedisDao.delToken(expiredToken.refresh_token);
    }
    var actExpire = Math.round(tokenInfo.accessTokenExpiresOn.getTime() / 1000);
    var refExpire = Math.round(tokenInfo.refreshTokenExpiresOn.getTime() / 1000);
    tokenInfo.app = app;
    tokenInfo.user_id = ctx.user._id.toString();
    var result = await Promise.all([
        tokenDao.saveToken(app, ctx.user._id, tokenInfo),
        tokenRedisDao.saveNewToken(tokenInfo.accessToken, actExpire, tokenInfo, 'access_token'),
        tokenRedisDao.saveNewToken(tokenInfo.refreshToken, refExpire, tokenInfo, 'refresh_token')
    ]);
    ctx.oauth = {
        app: app,
        mobile: ctx.user.mobile,
        user_id: tokenInfo.user_id,
        access_token: tokenInfo.accessToken,
        refresh_token: tokenInfo.refreshToken,
        access_expire_at: tokenInfo.accessTokenExpiresOn,
        refresh_expire_at: tokenInfo.refreshTokenExpiresOn
    };
    await next();
};
var bearerReply = async function(ctx, next) {
    ctx.oauth.oauth_type = 'bearer';
    ctx.result = ctx.oauth;
};
var getExistToken = async function(ctx, next) {
    var app = ctx.get('app');
    var userId = ctx.user._id.toString();
    var now = new Date();
    var tokenInfo = await tokenDao.getToken(app, userId);
    if (!tokenInfo || tokenInfo.refresh_expire_at < now) {
        await next()
    } else {
        ctx.oauth = {
            app: app,
            mobile: ctx.user.mobile,
            user_id: userId,
            access_token: tokenInfo.access_token,
            refresh_token: tokenInfo.refresh_token,
            access_expire_at: tokenInfo.access_expire_at,
            refresh_expire_at: tokenInfo.refresh_expire_at
        }
    }
    ctx.oauth.oauth_type = 'bearer';
    ctx.result = ctx.oauth;
};
var signout = async function(ctx, next) {
    var expiredToken = await tokenDao.delToken(ctx.oauth.app, ctx.oauth.user_id);
    await Promise.all([
        tokenRedisDao.delToken(expiredToken.access_token),
        tokenRedisDao.delToken(expiredToken.refresh_token)
    ]);
    ctx.logger.info(`用户 ${ctx.oauth.user_id} 登出app ${ctx.oauth.app}`);
};
var refresh = async function(ctx, next) {
    var refreshToken = ctx.query.refresh_token;
    var app = ctx.get('app');
    var now = new Date();
    var refreshTokenInfo = await tokenRedisDao.getTokenInfo(refreshToken, 'user_id', 'app_id', 'expire_at', 'type', 'access_token');
    if (!refreshTokenInfo[0] || refreshTokenInfo[1] !== app || refreshTokenInfo[3] !== 'refresh_token') {
        throw ERROR.AUTH.RE_SIGNIN;
    }
    var expire = new Date(+ refreshTokenInfo[2] * 1000);
    if (expire < now) {
        throw ERROR.AUTH.RE_SIGNIN;
    }
    var tokenInfo = {
        user_id: refreshTokenInfo[0],
        refreshToken,
        app
    };
    var accessTokenInfo = tokenService.refresh(expire);
    tokenInfo.accessToken = accessTokenInfo.accessToken;
    var actExpireSec = Math.round(accessTokenInfo.accessTokenExpiresOn.getTime() / 1000);
    await Promise.all([
        tokenRedisDao.saveNewToken(accessTokenInfo.accessToken, actExpireSec, tokenInfo, 'access_token'),
        tokenRedisDao.delToken(refreshTokenInfo[4]),
        tokenRedisDao.updateTokenInfo(refreshToken, 'access_token', accessTokenInfo.accessToken)
    ])
    ctx.oauth = {
        app,
        user_id: tokenInfo.user_id,
        access_token: accessTokenInfo.accessToken,
        refresh_token: refreshToken,
        access_expire_at: accessTokenInfo.accessTokenExpiresOn,
        refresh_expire_at: expire
    };
    await next();
    appDao.updateRefreshAt(app, tokenInfo.userId);
};
module.exports = {
    signin,
    signout,
    grantToken,
    bearerReply,
    getExistToken,
    refresh
}
