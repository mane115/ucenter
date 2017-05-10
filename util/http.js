var rq = require('request-promise');
var request = function(option) {
    return rq(option).then(result => {
        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        return result;
    })
};
/**
 * 封装的http get请求
 * @params url {string} 请求的url
 * @params headers {object} 请求带的头部
 * @return response {object} 请求结果
 * @author gh
 */
var get = function(url, headers) {
    var option = {
        uri: url,
        method: 'GET',
        headers: {}
    }
    if (headers) {
        option.headers = headers;
    };
    option.headers['content-type'] = 'application/json';
    return request(option)
};
/**
 * 封装的http post请求
 * @params url {string} 请求的url
 * @params data {object} 请求需要带的参数
 * @params headers {object} 请求带的头部
 * @return response {object} 请求结果
 * @author gh
 */
var post = function(url, data, headers) {
    var option = {
        uri: url,
        method: 'POST',
        headers: {}
    }
    if (data) {
        option.body = JSON.stringify(data);
    }
    if (headers) {
        option.headers = headers;
    }
    option.headers['content-type'] = 'application/json';
    return request(option)
};
/**
 * 封装的http put请求
 * @params url {string} 请求的url
 * @params data {object} 请求需要带的参数
 * @params headers {object} 请求带的头部
 * @return response {object} 请求结果
 * @author gh
 */
var put = function(url, data, headers) {
    var option = {
        uri: url,
        method: 'PUT',
        headers: {}
    }
    if (data) {
        option.body = JSON.stringify(data);
    }
    if (headers) {
        option.headers = headers;
    };
    option.headers['content-type'] = 'application/json';
    return request(option)
};
/**
 * 封装的http del请求
 * @params url {string} 请求的url
 * @params data {object} 请求需要带的参数
 * @params headers {object} 请求带的头部
 * @return response {object} 请求结果
 * @author gh
 */
var del = function(url, data, headers) {
    var option = {
        uri: url,
        method: 'DELETE',
        headers: {}
    }
    if (data) {
        option.body = JSON.stringify(data);
    }
    if (headers) {
        option.headers = headers;
    }
    option.headers['content-type'] = 'application/json';
    return request(option)
};
module.exports = {
    get,
    post,
    put,
    del
}
