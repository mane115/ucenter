var util = require('../../util');
var redis = util.redis;
var totalUserKey = app => `user:total:${app}`;
var userLoginKey = (app, date = new Date()) => {
    var today = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    return `${year}-${month}-${today}:${app}`;
};
/**
  @todo 增加用户总数
  @param app {String} appid
  @return total {String} user count
  @author gh
 */
var incTotal = function(app) {
    var key = totalUserKey(app);
    return redis.incrAsync(key);
};
/**
  @todo 获取用户总数
  @param app {String} appid
  @return total {String} user count
  @author gh
 */
var getTotal = function(app) {
    var key = totalUserKey(app);
    return redis.getAsync(key);
};
/**
  @todo 记录用户登录状态
  @param userId {String} 用户短id (user count)
  @param app {String} appid
  @return result {Number} 0 | 1
  @author gh
  */
var daySignInRecord = async function(userId, app) {
    var date = new Date();
    var key = userLoginKey(app, date);
    await redis.setbitAsync(key, userId, 1);
    redis.exprie(key)
};
/**
  @todo 记录用户登出状态
  @param userId {String} 用户短id (user count)
  @param app {String} appid
  @return result {Number} 0 | 1
  @author gh
  */
var daySignOutRecord = function(userId, app) {
    var key = userLoginKey(app);
    return redis.setbitAsync(key, userId, 0);
};
/**
  @todo 获取在线用户总数
  @param app {String} appid
  @return count {String} 在线用户总数
  @author gh
  */
var getOnlineCount = function(app) {
    var key = userLoginKey(app);
    return redis.bitcountAsync(key, 0, -1);
};
moduele.exports = {
    incTotal,
    getTotal,
    daySignInRecord,
    daySignOutRecord,
    getOnlineCount
}
