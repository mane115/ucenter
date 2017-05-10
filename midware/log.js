const log4js = require('log4js'),
    adminLogger = log4js.getLogger('admin'),
    oauthLogger = log4js.getLogger('oauth'),
    commonLogger = log4js.getLogger('common'),
    userLogger = log4js.getLogger('user');
var user = async(ctx, next) => {
    ctx.logger = userLogger;
    await next()
};
var oauth = async(ctx, next) => {
    ctx.logger = oauthLogger;
    await next()
};
var admin = async(ctx, next) => {
    ctx.logger = adminLogger;
    await next()
};
var common = async(ctx, next) => {
    ctx.logger = commonLogger;
    await next()
};
module.exports = {
    user,
    oauth,
    admin,
    common
}
