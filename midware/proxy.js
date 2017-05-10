// var rp = require('request-promise');
var request = require('request');
var Promise = require('bluebird');
var _ = require('lodash');
var parseJSON = function(string) {
    try {
        string = JSON.parse(string);
    } catch (err) {} finally {
        return string;
    }
};
/**
 * 转发中间件
 * @author gh
 * @param {Object} option
 * @param {String} option.target 代理目标地址
 * @param {Array} option.apiProxyPath 制定的的代理转发路径集合
 * @param {Function} option.onReq 代理转发的前置函数（代理请求前钩子） !必须使用Promise
 * @param {Function} option.onRes 代理转发的后置函数（代理响应后钩子） !必须使用Promise
 * @param {Function} option.onErr 代理转发的错误函数（代理报错时钩子）
 * @return {Function} midware 返回代理中间件
 * @note
 *  1.必须在此中间件前使用session，以此兼容session-cookie模式的网站
 *  2.必须在此中间件前使用bodyparser，以此通过body传递的数据
 *  3.未兼容form等形式请求的数据
 *  4.代理转发的前置函数（代理请求前钩子） !必须使用Promise
 *    @param {Object} [option] http转发的option
 *    @param {Object} [req] node原生req
 *    @param {Object} [res] node原生res
 *    @return {Promise} promise的完成状态
 *    @example option.onReq = function(option, req, res){}
 *
 *  代理转发的后置函数（代理响应后钩子） !必须使用Promise
 *    @param {Object} [data] http转发获得的结果
 *    @param {Object} [req] node原生req
 *    @param {Object} [res] node原生res
 *    @return {Promise} promise的完成状态
 *    @example option.onRes = function(data, req, res){}
 *
 * 代理转发的错误函数（代理报错时钩子）
 *    @param {Error} [err] http转发发生的错误
 *    @param {Object} [req] node原生req
 *    @param {Object} [res] node原生res
 *    @param {Function} [next] express的next函数
 *    @return {Promise} promise的完成状态
 *    @example option.onErr = function(err, req, res, next){}
 */
var proxy = function(option) {
    if (!option.target) {
        throw new Error('proxy must have target')
    }
    var target = option.target;
    var apiProxyPath,
        onReq,
        onRes,
        onErr;
    if (option.apiProxyPath && _.isArray(option.apiProxyPath)) {
        apiProxyPath = option.apiProxyPath;
    }
    if (option.onReq && typeof option.onReq === 'function') {
        onReq = option.onReq;
    }
    if (option.onRes && typeof option.onRes === 'function') {
        onRes = option.onRes;
    }
    if (option.onErr && typeof option.onErr === 'function') {
        onErr = option.onErr;
    }
    var filterProxyPath = function(url) {
        var test = false;
        if (!apiProxyPath || apiProxyPath.length === 0) {
            return target + url
        }
        apiProxyPath.forEach(path => {
            if (RegExp(path).test(url)) {
                test = true;
            }
        })
        return test ? target + url : test;
    };
    return (req, res, next) => {
        var url = filterProxyPath(req.url);
        if (!url) {
            return next();
        }
        var option = {
            method: req.method,
            uri: url,
            headers: req.headers
        };
        if (!req.session) {
            throw new Error('proxy midware need session');
        }
        if (req.method === 'POST' && !_.isEmpty(req.body)) {
            option.body = JSON.stringify(req.body);
            option.headers['content-type'] = 'application/json';
        }
        if (req.session.xSession) {
            option.headers['Cookie'] = req.session.xSession;
        }
        var handleRequest = () => {
            delete option.headers.host;
            delete option.headers['content-length'];
            delete option.headers['accept-encoding'];
            delete option.headers['accept-language'];
            return new Promise((success, fail) => {
                request(option, (err, res, body) => {
                    if (err) {
                        return fail(err)
                    }
                    if (!req.session.xSession) {
                        let cookie = res.headers['set-cookie'];
                        req.session.xSession = cookie;
                    }
                    return success(parseJSON(body));
                })
            })
        };
        var handleError = err => {
            if (onErr) {
                return onErr(err, req, res, next)
            } else {
                return console.log(err)
            }
        };
        var handleBefore = () => {
            if (onReq) {
                return onReq(option, req, res)
            } else {
                return Promise.resolve();
            }
        };
        var handleAfter = data => {
            if (onRes) {
                return onRes(data, req, res).then(result => data);
            } else {
                return Promise.resolve(data);
            }
        };
        var response = data => {
            if (typeof data === 'object') {
                res.json(data)
            } else {
                res.redirect(url)
            }
        };
        handleBefore().then(handleRequest).then(handleAfter).then(response).catch(handleError);
    }
}
module.exports = proxy
