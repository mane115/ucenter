var util = require('../../util');
var redis = util.redis;
/**
  * 验证app id与app secrect
  * @params app {string} 需要验证的app id
  * @params app {string} 需要验证的app secrect
  * @return result {Boolean} 验证结果 true合法 |false非法
  * @author gh
  * @note 这里可以使用session记录验证记录，不需要每次都读redis
  */
var getCacheApp = async function(app, secrect) {
    var result = await redis.hgetAsync('apps', app);
    if (!result || result !== secrect) {
        return false
    }
    return true
};
/**
  * 验证app是否存在
  * @params app {string} 需要加入的app
  * @return result {boolean} 验证结果 true存在 | false不存在
  * @author gh
  */
var existApp = function(app) {
    return redis.hexistsAsync('apps', app);
};
/**
  * admin 加入 app
  * @params app {string} 需要加入的app
  * @params secrect {string} app对应的secrect
  * @return result {boolean} 插入结果 true成功 | false失败
  * @author gh
  */
var addApp = function(app, secrect) {
    return redis.hsetAsync('apps', app, secrect);
};
/**
 * admin 获取 app详情
 * @params app {string} 需要加入的app
 * @return secrect {string} app对应的secrect
 * @author gh
 */
var getAppSecrect = function(app) {
    return redis.hgetAsync('apps', app)
};
/**
 * admin 获取 app列表
 * @params app {string} 需要加入的app
 * @return result {object} key:app value:secrect
 * @author gh
 */
var getApps = function() {
    return redis.hgetallAsync('apps');
}
module.exports = {
    getCacheApp,
    existApp,
    addApp,
    getAppSecrect,
    getApps
}
