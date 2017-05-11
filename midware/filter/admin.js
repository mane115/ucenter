var ERROR = require('../../common/error.map.js');
var util = require('../../util');
var addApp = async function(ctx, next) {
    var body = ctx.request.body;
    if (!body.app) {
        throw ERROR.DATA.REQUIRE('app')
    };
    await next()
};
module.exports = {
    addApp
}
