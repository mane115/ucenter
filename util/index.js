var fs = require('fs');
var Promise = require('bluebird');
var spawn = require('child_process').spawn;
var Redis = require('redis');
var config = require('../config');
var _uuid = require('node-uuid');

Promise.promisifyAll(fs);
/**
 * 加载redis
 * @author gh
 */
var initRedis = function() {
    return new Promise((success, fail) => {
        var redisConfig = config.database.redis;
        var redis;
        if(redisConfig.url){
          redis = Redis.createClient(redisConfig.url);
        }else {
          redis = Redis.createClient(redisConfig.port, redisConfig.host)
        }
        if (redisConfig.pwd) {
            redis.auth(redisConfig.pwd)
        }
        redis.on('error', function(err) {
            console.warn(err)
            fail()
        })
        redis.select(redisConfig.library, function(err, info) {
            console.log(`init redis success url:${redisConfig.host},db:${redisConfig.library}`);
            Promise.promisifyAll(Redis.RedisClient.prototype);
            Promise.promisifyAll(Redis.Multi.prototype);
            module.exports.redis = redis;
            success()
        });
    })
};
/**
 * 检查更新项，筛选允许更新的属性
 * @param tocheckObj {object} 需检查的更新对象
 * @param properties {array} 允许更新的属性
 * @return update {object} 筛选属性后的更新对象
 * @author gh
 */
var checkUpdate = function(tocheckObj, properties) {
    var update = {};
    properties.forEach(property => {
        if (tocheckObj[property])
            update[property] = tocheckObj[property]
    })
    return update;
};
/**
 * koa用于统一处理返回格式的中间件、记录访问api
 * @note 中间件请求回溯流程
   request  -> handleResponse(logger)  ->   api router -|
   response <- handleResponse(arrange res) <------------|
 * @author gh
 */
var handleResponse = async function(ctx, next) {
    try {
        logger.trace(`ip ${ctx.ip} ${ctx.method} url:${ctx.url}`);
        await next();
        if (ctx.body) {
            return;
        }
        let response = {
            code: 0,
            message: 'operation success'
        };
        if (ctx.result && ctx.result.result) {
            response.result = ctx.result.result;
        } else if (ctx.result) {
            response.result = ctx.result;
        }
        ctx.body = response;
    } catch (err) {
        ctx.body = err;
    }
};
/**
 * 执行脚本
 * @param file {string} 执行脚本存放的位置
 * @param onData {function} 之行脚本后回显数据的回调函数
 * @return {Promise}
 * @author gh
 */
var execFile = function(file, onData) {
    return new Promise((success, fail) => {
        var cmd = spawn(file);
        cmd.stdout.on('data', onData);
        cmd.stderr.on('data', onData);
        cmd.on('close', (code) => {
            success();
        });
    })
};
/**
 * 生成uuid的类
 * @constructor
 */
var UUID = function() {
    this.uuid = _uuid
};
UUID.prototype.v1 = function() {
    return _uuid.v1().split('-').join('')
};
UUID.prototype.v4 = function() {
    return _uuid.v4().split('-').join('')
};
/**
 * 获取 0~1之间随机数 默认保留2位小数
 * @params fix {number} 需要保留的小数位数 default 2
 * @return result {number} 随机数
 * @author gh
 */
var getRandom = function(fix = 2) {
    return + Math.random().toFixed(+ fix)
};
/**
 * 生成固定长度的随机数字，用于生成验证码
 * @param length {number} 随机数字长度 默认6位
 * @param chance {number} 0～1几率控制，传入0~1之间的值可以控制返回的随机值为固定值
 * @return number 随机数字
 * @author gh
 */
var getRandomCode = function(length = 6, chance = Math.random()) {
    var max = Math.pow(10, length);
    var min = 0;
    var base = Math.ceil(chance * max).toString();
    var baseLen = base.length;
    if (baseLen < length) {
        let zero = length - baseLen;
        let fill = Math.pow(10, zero).toString();
        fill = fill.substring(1);
        base = fill + base
    }
    if (+ base === 0)
        base = Math.pow(10, length).toString().substring(1);;
    return base
};
/**
  统一电话号码格式，去除区号
  @param mobile {string} 电话号码
  @return mobile {string} 统一格式的电话号码
  @author gh
*/
var fixMobile = function(mobile) {
    if (mobile.indexOf('+86-') !== -1) {
        mobile = mobile.replace('+86-', '')
    }
    return mobile;
};
var regexp = {
    /**
      正则匹配电话号码 仅支持大陆号码
      @param mobile {string} 电话号码
      @return result {boolean} 判断结果 true正确 | false 非法号码
      @author gh
    */
    mobile: mobile => /^[1][34578][0-9]{9}$/.test(mobile)
};
module.exports = {
    fs,
    checkUpdate,
    handleResponse,
    execFile,
    initRedis,
    UUID,
    getRandom,
    getRandomCode,
    fixMobile,
    regexp
}
