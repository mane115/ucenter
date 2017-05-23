var util = require('../../util');
var redis = util.redis;
var tokenKey = token => `token:${token}`;
/**
 * 获取redis中token信息
 * @param token {string} token
 * @param key {string} token单独的键 (如空则返回token所有的信息)
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
 * 删除redis中token信息
 * @param token {string} token
 * @return result {string} 删除结果 "ok"
 * @author gh
 */
var delToken = function(token) {
    token = tokenKey(token);
    return redis.delAsync(token)
};
/**
 * 储存token信息
 * @param token {string} token
 * @param expire {timestamp} 存活至何时 单位:秒
 * @param tokenInfo {object} token信息集合
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
 * @param token {string} 需要更新的token
 * @param key {string} 需要更新的token中的属性
 * @param key {string} 需要更新的token中的属性对应的值
 * @author gh
 */
var updateTokenInfo = function(token, key, value) {
    token = tokenKey(token);
    return redis.hsetAsync(token, key, value)
};
/**
  * 生成临时token 可用于验证合法请求（第三方oauth2）
  * @param expire {string} token生效时间 单位：秒
  * @return token {string} 生成的临时token
  * @author gh

*/
var grantTempToken = async function(expire) {
    var tempToken = `temp:${Date.now()}`;
    await redis.setexAsync(tempToken, expire, 1);
    return tempToken;
};
/**
  * 验证临时token合法性
  * @param token {string} token name
  * @return result {boolean} is vaild
  * @author gh

*/
var validateTempToken = async function(token) {
    var result = await redis.existsAsync(token);
    if (result) {
        await redis.delAsync(token)
    }
    return result;
};
module.exports = {
    saveNewToken,
    delToken,
    getTokenInfo,
    delToken,
    updateTokenInfo,
    grantTempToken,
    validateTempToken
}
