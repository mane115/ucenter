const userDao = require('../dao/user'),
    tokenDao = require('../dao/token'),
    appDao = require('../dao/app'),
    tokenRedisDao = require('../dao/redis/token'),
    userRedisDao = require('../dao/redis/user'),
    passport = require('../service/passport'),
    STATUS = require('../common/const').STATUS,
    ERROR = require('../common/error.map');
var create = async function(ctx, next) {
    var body = ctx.request.body;
    var app = ctx.get('app');
    var user = await userDao.findUserByMobile(body.mobile);
    if (user && user.apps && user.apps.length !== 0 && user.apps.indexOf(app) !== -1) {
        throw ERROR.USER.EXIST;
    } else if (user) {
        await userDao.addApp(user._id, app);
    } else {
        user = await userDao.createUserByMobile(body.mobile, app);
    }
    var results = await Promise.all([
        passport.encrypt(body.password),
        userRedisDao.incTotal(app)
    ]);
    var password = results[0];
    var shortId = results[1];
    await appDao.create(app, user._id, password, shortId);
    ctx.user = user.toJSON()
    ctx.user.user_short_id = shortId;
    ctx.logger.info(`用户 ${body.mobile} 注册app ${app}`)
    await next()
};
var getInfo = async function(ctx, next) {
    var user = await userDao.getInfo(ctx.oauth.user_id, ctx.oauth.app);
    ctx.result = {
        user_id: user._id,
        mobile: user.mobile,
        chance: user.chance
    };
};
var updatePassword = async function(ctx, next) {
    var body = ctx.request.body;
    var appInfo = await appDao.find(ctx.oauth.app, ctx.oauth.user_id);
    if (!appInfo || !appInfo.password) {
        throw ERROR.USER.NOT_EXIST;
    }
    if (appInfo.status !== STATUS.USER.ACTIVE) {
        throw ERROR.USER.NOT_ACTIVE;
    }
    var result = await passport.validate(body.old_password, appInfo.password);
    if (!result) {
        throw ERROR.OAUTH.PASSWORD_ERROR;
    }
    var newPasswordHash = await passport.encrypt(body.new_password);
    await appDao.updatePassword(appInfo._id, newPasswordHash);
    ctx.logger.info(`用户 ${ctx.oauth.user_id} 修改密码`);
    await next();
};
var resetPassword = async function(ctx, next) {
    var body = ctx.request.body;
    var app = ctx.get('app');
    var userInfo = await userDao.findUserByMobile(body.mobile);
    if (!userInfo) {
        throw ERROR.USER.NOT_EXIST;
    }
    var appInfo = await appDao.find(app, userInfo._id);
    if (!appInfo || !appInfo.password) {
        throw ERROR.USER.NOT_EXIST;
    }
    if (appInfo.status !== STATUS.USER.ACTIVE) {
        throw ERROR.USER.NOT_ACTIVE;
    }
    var passwordHash = await passport.encrypt(body.password);
    await appDao.updatePassword(appInfo._id, passwordHash);
    ctx.logger.info(`用户 ${body.mobile} 重置密码 app ${app}`);
    await next();
    //强制用户登出
    var expiredToken = await tokenDao.delToken(app, userInfo._id);
    tokenRedisDao.delToken(expiredToken.access_token);
    tokenRedisDao.delToken(expiredToken.refresh_token);
};
module.exports = {
    create,
    getInfo,
    updatePassword,
    resetPassword
}
