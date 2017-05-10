var ERROR = require('../../common/error.map.js');
// var _const = require('../../common/const');
var config = require('../../config');
var util = require('../../util');
var sendSMS = async function(ctx, next) {
    var type = ctx.params.type;
    var mobile = ctx.request.body.mobile;
    if (!type || !config.smsType[type]) {
        throw ERROR.DATA.INVALID_DATA('type')
    }
    if (!mobile) {
        throw ERROR.DATA.REQUIRE('mobile')
    }
    ctx.request.body.mobile = util.fixMobile(mobile);
    if (!util.regexp.mobile(mobile)) {
        throw ERROR.DATA.INVALID_DATA('mobile')
    }
    await next()
};
module.exports = {
    sendSMS
}
