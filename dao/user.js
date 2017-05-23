var mongo = require('../model/mongo'),
    passwordService = require('../service/passport'),
    ERROR = require('../common/error.map.js'),
    util = require('../util');

/**
 * 通过手机查询用户
 * @param mobile {string} 用户手机
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
 * @param userId {string} 用户_id
 * @param app {string} app号
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
 * @param mobile {string} 用户手机
 * @param app {string} app号
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
 * @param userId {string} 用户_id
 * @param app {string} app号
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
/**
  * 根据oauth2获取的用户信息查询用户
  * @param platform
  * @param platform_user_id
  * @return user {object} user info
  */
var findUserByOauth = function(platform, platform_user_id) {
    var condition = {
        'oauth.platform': platform,
        'oauth.platform_user_id': platform_user_id
    };
    return mongo.users.findOne(condition);
};
/**
  * 根据oauth2授权创建用户数据
  * @param oauthUser {object} oauth user info
  * @param oauthUser.platform {string} oauth platform
  * @param oauthUser.platform_user_id {string} oauth platform user id
  * @param oauthUser.platform_user_name {string} oauth platform user name
  * @param oauthUser.email {string} oauth platform user email
  * @param oauthUser.avatar {string} oauth platform user avatar
  * @return user {object} user info
  * @author gh
  */
var createUserByOauth = function(oauthUser) {
    var user = {
        mobile: `${oauthUser.platform}:${oauthUser.platform_user_id}`,
        apps: [oauthUser.platform],
        name: oauthUser.platform_user_name,
        oauth: [
            {
                platform: oauthUser.platform,
                platform_user_id: oauthUser.platform_user_id,
                platform_user_name: oauthUser.platform_user_name,
                email: oauthUser.email,
                avatar: oauthUser.avatar
            }
        ]
    };
    return mongo.users.create(user);
};
module.exports = {
    createUserByMobile,
    findUserByMobile,
    addApp,
    getInfo,
    createUserByOauth,
    findUserByOauth,
    createUserByOauth
}
