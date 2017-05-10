var appRedisDao = require('../dao/redis/app');
var ERROR = require('../common/error.map.js');
var util = require('../util');
var addApp = async function(ctx, next) {
    var app = ctx.request.body.app;
    var uuid = new util.UUID().v4();
    var result = await appRedisDao.existApp(app);
    if (result) {
        throw ERROR.ADMIN.APP_EXIST
    }
    await appRedisDao.addApp(app, uuid);
    ctx.logger.info(`admin add app ${app} secrect : ${uuid}`);
    ctx.result = {
        app: app,
        secrect: uuid
    }
};
var getApp = async function(ctx, next) {
    var app = ctx.params.app;
    if (app) {
        let secrect = await appRedisDao.getAppSecrect(app);
        ctx.result = {};
        ctx.result[app] = secrect;
    } else {
        let appInfo = await appRedisDao.getApps();
        ctx.result = appInfo
    }
};
module.exports = {
    addApp,
    getApp
}
