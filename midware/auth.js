var appRedisDao = require('../dao/redis/app');
var tokenRedisDao = require('../dao/redis/token');
var verifyCodeRedisDao = require('../dao/redis/verify_code');
var ERROR = require('../common/error.map.js');
var util = require('../util');
var config = require('../config');
var verifyApp = async function(ctx, next) {
    var app = ctx.get('app');
    var secrect = ctx.get('secrect');
    if (!app || !secrect) {
        throw ERROR.AUTH.APP;
    }
    var test = await appRedisDao.getCacheApp(app, secrect);
    if (!test) {
        throw ERROR.AUTH.APP;
    }
    await next()
};
var getTokenInfo = async function(ctx, next) {
    var app = ctx.get('app');
    var token = ctx.get('Authorization');
    if (!token) {
        throw ERROR.AUTH.UNAUTH
    }
    token = token.split(' ');
    if (token.length !== 2) {
        throw ERROR.AUTH.UNAUTH
    }
    var tokenInfo = await tokenRedisDao.getTokenInfo(token[1], 'user_id', 'app_id', 'type', 'user_short_id');
    var accessToken = token[1];
    var oauthType = token[0];
    var userId = tokenInfo[0];
    var tokenApp = tokenInfo[1];
    var tokenType = tokenInfo[2];
    var userShortId = tokenInfo[3];
    if (!userId || tokenApp !== app || tokenType !== 'access_token') {
        throw ERROR.AUTH.UNAUTH
    }
    ctx.oauth = {
        user_id: userId,
        access_token: accessToken,
        oauth_type: oauthType,
        app: app,
        user_short_id: userShortId
    };
    await next();
};
var sendSMS = async function(ctx, next) {
    var body = ctx.request.body;
    var app = ctx.get('app');
    var code = util.getRandomCode();
    var type = ctx.params.type;
    //ali dayu or else
    await verifyCodeRedisDao.saveCode(code, type, app, body.mobile);
    ctx.logger.info(`mobile ${body.mobile} sms code:${code} ${app}:${type}`);
};
var verifySMS = function(type) {
    return async function(ctx, next) {
        var body = ctx.request.body;
        var app = ctx.get('app');
        // var type = ctx.params.type;
        var mobile = body.mobile;
        if (body.verify_code === config.backdoorCode) {
            ctx.logger.info(`mobile ${mobile} verify backend code`);
        } else {
            let code = await verifyCodeRedisDao.getCode(mobile, type, app);
            if (!code || code !== body.verify_code) {
                throw ERROR.AUTH.SMS
            }
        }
        await verifyCodeRedisDao.delCode(mobile, type, app);
        await next()
    };
}

module.exports = {
    verifyApp,
    getTokenInfo,
    sendSMS,
    verifySMS
}
