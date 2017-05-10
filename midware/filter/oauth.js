var ERROR = require('../../common/error.map.js');
var util = require('../../util');
var signup = async function(ctx, next) {
    var body = ctx.request.body;
    if (!body.mobile) {
        throw ERROR.DATA.REQUIRE('mobile');
    }
    if (!body.password) {
        throw ERROR.DATA.REQUIRE('password');
    }
    if (!body.verify_code) {
        throw ERROR.DATA.REQUIRE('verify code');
    }
    ctx.request.body.mobile = util.fixMobile(ctx.request.body.mobile);
    if (!util.regexp.mobile(ctx.request.body.mobile)) {
        throw ERROR.DATA.INVALID_DATA('mobile')
    }
    await next();
};
var signin = async function(ctx, next) {
    var body = ctx.request.body;
    if (!body.mobile) {
        throw ERROR.DATA.REQUIRE('mobile');
    }
    if (!body.password) {
        throw ERROR.DATA.REQUIRE('password');
    }
    ctx.request.body.mobile = util.fixMobile(ctx.request.body.mobile);
    if (!util.regexp.mobile(ctx.request.body.mobile)) {
        throw ERROR.DATA.INVALID_DATA('mobile')
    }
    await next();
}
module.exports = {
    signup,
    signin
}
