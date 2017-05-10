var mongo = require('../model/mongo'),
    passwordService = require('../service/passport'),
    ERROR = require('../common/error.map.js'),
    util = require('../util');

var getToken = function(appId, userId) {
    var condition = {
        user_id: userId,
        app_id: appId
    };
    return mongo.tokens.findOne(condition);
};
var saveToken = function(appId, userId, tokenInfo) {
    var update = {};
    if (tokenInfo.accessToken) {
        update.access_token = tokenInfo.accessToken;
        update.access_expire_at = tokenInfo.accessTokenExpiresOn;
    }
    if (tokenInfo.refreshToken) {
        update.refresh_token = tokenInfo.refreshToken;
        update.refresh_expire_at = tokenInfo.refreshTokenExpiresOn;
    }
    var condition = {
        user_id: userId,
        app_id: appId
    };
    var option = {
        upsert: true
    };
    return mongo.tokens.update(condition, update, option)
};
var delToken = function(appId, userId) {
    var condition = {
        user_id: userId,
        app_id: appId
    };
    return mongo.tokens.findOneAndRemove(condition)
};
module.exports = {
    getToken,
    saveToken,
    delToken
}
