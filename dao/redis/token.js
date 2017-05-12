var util = require('../../util');
var redis = util.redis;
var tokenKey = token => `token:${token}`;
/**
 * 获取redis中token信息
 * @params token {string} token
 * @params key {string} token单独的键 (如空则返回token所有的信息)
 * @return tokenInfo {string | object} token信息
 * @author gh
 */
var getTokenInfo = function(token, ...key) {
    token = tokenKey(token);
    if (key && key.length === 1) {
        return redis.hgetAsync(token, key);
    } else if (key && key.length > 1) {
        return redis.hmgetAsync(token, key);
    } else {
        return redis.hgetallAsync(token);
    }
};
/**
 * 删除edis中token信息
 * @params token {string} token
 * @return result {string} 删除结果 "ok"
 * @author gh
 */
var delToken = function(token) {
    token = tokenKey(token);
    return redis.delAsync(token)
};
/**
 * 储存token信息
 * @params token {string} token
 * @params expire {timestamp} 存活至何时 单位:秒
 * @params tokenInfo {object} token信息集合
 *         tokenInfo.accessToken {string} access token
 *         tokenInfo.refreshToken {string} refresh token
 *         tokenInfo.app {string} token对应的app id
 *         tokenInfo.user_id {string} token对应的user id
 * @params type {string} token类型 "access_token" | "refresh_token"
 * @return result {string} 存储结果 "ok"
 * @author gh
 */
var saveNewToken = async function(token, expire, tokenInfo, type = 'access_token') {
    token = tokenKey(token);
    // await redis.hmsetAsync(token, 'access_token', tokenInfo.accessToken, 'refresh_token', tokenInfo.refreshToken, 'app_id', tokenInfo.app, 'user_id', tokenInfo.user_id, 'expire_at', expire, 'type', type);
    // await redis.hmsetAsync(token, 'access_token', tokenInfo.accessToken, 'refresh_token', tokenInfo.refreshToken, 'app_id', tokenInfo.app, 'user_id', tokenInfo.user_id, 'expire_at', expire, 'type', type);
    var hashValue = {
        access_token: tokenInfo.accessToken,
        refresh_token: tokenInfo.refreshToken,
        app_id: tokenInfo.app,
        user_id: tokenInfo.user_id,
        expire_at: expire,
        type: type
    };
    if (tokenInfo.user_short_id) {
        hashValue.user_short_id = tokenInfo.user_short_id
    }
    await redis.hmsetAsync(token, hashValue)
    return redis.expireatAsync(token, expire);
};
/**
 * 更新token信息
 * @params token {string} 需要更新的token
 * @params key {string} 需要更新的token中的属性
 * @params key {string} 需要更新的token中的属性对应的值
 * @author gh
 */
var updateTokenInfo = async function(token, key, value) {
    token = tokenKey(token);
    return redis.hsetAsync(token, key, value)
};
module.exports = {
    saveNewToken,
    delToken,
    getTokenInfo,
    delToken,
    updateTokenInfo
}
