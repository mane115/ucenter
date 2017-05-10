var mongo = require('../model/mongo'),
    passwordService = require('../service/passport'),
    ERROR = require('../common/error.map.js'),
    util = require('../util');
/**
 * 创建用户独立app信息
 * @params app {string} app号
 * @params userId {string} 用户实体id
 * @params password {string} 加盐加密后的密码
 * @return app {object} 用户app实体数据
 * @author gh
 */
var create = function(app, userId, password) {
    var entity = {
        app_id: app,
        user_id: userId,
        password: password
    };
    return mongo.apps.create(entity);
};
/**
 * 获取用户独立app信息
 * @params app {string} app号
 * @params userId {string} 用户实体id
 * @return app {object} 用户app实体数据
 * @author gh
 */
var find = function(app, userId) {
    var condition = {
        app_id: app,
        user_id: userId
    };
    return mongo.apps.findOne(condition)
};
/**
 * 获取用户独立app信息
 * @params id {string} app数据主键
 * @return app {object} 用户app旧的实体数据
 * @author gh
 */
var updateLoginAt = function(id) {
    var update = {
        $inc: {
            login_times: 1
        },
        last_login: Date.now()
    };
    return mongo.apps.findByIdAndUpdate(id, update).catch(console.log)
};
/**
 * 获取用户独立app信息
 * @params app {string} app号
 * @params userId {string} 用户实体id
 * @return result {object} 更新结果
 * @author gh
 */
var updateRefreshAt = function(app, userId) {
    var condition = {
        app_id: app,
        user_id: userId
    };
    var update = {
        last_refresh: Date.now()
    };
    return mongo.apps.update(condition, update).catch(console.log)
};
/**
 * 修改用户独立app密码
 * @params id {string} app实体id
 * @params password {string} 新密码
 * @return result {object} 更新前的查询结果
 * @author gh
 */
var updatePassword = function(id, password) {
    var update = {
        update_at: Date.now(),
        password: password
    };
    return mongo.apps.findByIdAndUpdate(id, update)
};
module.exports = {
    create,
    find,
    updateLoginAt,
    updateRefreshAt,
    updatePassword
}
