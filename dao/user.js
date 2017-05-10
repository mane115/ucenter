var mongo = require('../model/mongo'),
    passwordService = require('../service/passport'),
    ERROR = require('../common/error.map.js'),
    util = require('../util');

/**
 * 通过手机查询用户
 * @params mobile {string} 用户手机
 * @return user {object} 用户实体数据
 * @author gh
 */
var findUserByMobile = function(mobile) {
    var condition = {
        mobile: mobile
    };
    return mongo.users.findOne(condition);
};
/**
 * 新增用户的app
 * @params userId {string} 用户_id
 * @params app {string} app号
 * @return user {object} 用户更新前实体数据
 * @author gh
 */
var addApp = function(userId, app) {
    var update = {
        $push: {
            apps: app
        }
    };
    return mongo.users.findByIdAndUpdate(userId, update);
};
/**
 * 创建用户信息
 * @params mobile {string} 用户手机
 * @params app {string} app号
 * @return user {object} 用户实体数据
 * @author gh
 */
var createUserByMobile = function(mobile, app) {
    var entity = {
        mobile: mobile,
        apps: [app]
    };
    return mongo.users.create(entity)
};
/**
 * 获取用户信息
 * @params userId {string} 用户_id
 * @params app {string} app号
 * @author gh
 */
var getInfo = function(userId, app) {
    var condition = {
        _id: userId,
        apps: app,
        // status: STATUS.USER.ACTIVE
    };
    var filter = {
        mobile: 1,
        _id: 1,
        chance: 1
    };
    return mongo.users.findOne(condition, filter)
};
module.exports = {
    createUserByMobile,
    findUserByMobile,
    addApp,
    getInfo
}
