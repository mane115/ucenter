var ERROR = require('../../common/error.map');
var util = require('../../util');
var updatePassword = async function(ctx, next) {
    var body = ctx.request.body;
    if (!body.old_password) {
        throw ERROR.DATA.REQUIRE('old password')
    }
    if (!body.new_password) {
        throw ERROR.DATA.REQUIRE('new password')
    }
    if (body.old_password === body.new_password) {
        throw ERROR.USER.SAME_PASSWORD
    }
    await next()
};
var resetPassword = async function(ctx, next) {
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
module.exports = {
    updatePassword,
    resetPassword
}
