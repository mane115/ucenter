var util = require('../../util');
var config = require('../../config');
var redis = util.redis;
var codeKey = (code, type, app) => `${app}:${type}:${code}`;
var mobileKey = (mobile, type, app) => `${app}:${type}:${mobile}`;
/**
 * 根据验证类型缓存短信验证码
 * @params mobile {string} 验证短信发送的手机
 * @params type {string} 短信类型
 * @params app {string} 短信对应的app
 * @params code {string} 短信验证码
 * @author gh
 */
var saveCode = function(code, type, app, mobile) {
    var key = mobileKey(mobile, type, app);
    return redis.setexAsync(key, config.expire.smsCode, code);
};
/**
 * 获取特定类型手机对应的验证码
 * @params mobile {string} 验证短信发送的手机
 * @params type {string} 短信类型
 * @params app {string} 短信对应的app
 * @return code {string} 短信验证码
 * @author gh
 */
var getCode = function(mobile, type, app) {
    var key = mobileKey(mobile, type, app);
    return redis.getAsync(key);
};
/**
 * 删除短信验证码对应数据
 * @params mobile {string} 验证短信发送的手机
 * @params type {string} 短信类型
 * @params app {string} 短信对应的app
 * @author gh
 */
var delCode = function(mobile, type, app) {
    var key = mobileKey(mobile, type, app);
    return redis.delAsync(key);
};
module.exports = {
    saveCode,
    getCode,
    delCode
}
