var rq = require('request-promise');
var _ = require('lodash');
// var request = async function(option) {
//     return rq(option).then(result => {
//         if (typeof result === 'string') {
//             result = JSON.parse(result);
//         }
//         return result;
//     })
// };
class Http {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.request = async function(option) {
            var result = await rq(option);
            if (typeof result === 'string') {
                result = JSON.parse(result);
            }
            return result;
        }
    }
    get(url, headers) {
        var option = {
            uri: `${this.baseUrl}${url}`,
            method: 'GET',
            headers: {}
        }
        if (!_.isEmpty(headers)) {
            option.headers = headers;
        };
        option.headers['content-type'] = 'application/json';
        console.log('test', option)
        return this.request(option)
    }
    post(url, data, headers) {
        var option = {
            uri: `${this.baseUrl}${url}`,
            method: 'POST',
            headers: {}
        }
        if (!_.isEmpty(data)) {
            option.body = JSON.stringify(data);
        }
        if (!_.isEmpty(headers)) {
            option.headers = headers;
        }
        option.headers['content-type'] = 'application/json';
        return this.request(option)
    }
    put(url, data, headers) {
        var option = {
            uri: `${this.baseUrl}${url}`,
            method: 'PUT',
            headers: {}
        }
        if (!_.isEmpty(data)) {
            option.body = JSON.stringify(data);
        }
        if (!_.isEmpty(headers)) {
            option.headers = headers;
        };
        option.headers['content-type'] = 'application/json';
        return this.request(option)
    }
    del(url, data, headers) {
        var option = {
            uri: `${this.baseUrl}${url}`,
            method: 'DELETE',
            headers: {}
        }
        if (!_.isEmpty(data)) {
            option.body = JSON.stringify(data);
        }
        if (!_.isEmpty(headers)) {
            option.headers = headers;
        }
        option.headers['content-type'] = 'application/json';
        return this.request(option)
    }
};
class Square extends Http {
    constructor() {
        super('http://127.0.0.1:3100/api/square/v1');
        this.handleResult = function(result) {
            if (result.code !== 0) {
                throw result;
            }
            return result;
        }
        this.getHeader = function(token) {
            if (!token) {
                return false
            }
            return {Authorization: `bearer ${token}`}
        };
    }
    async get(url, token) {
        var result = await super.get(url, this.getHeader(token));
        return this.handleResult(result)
    }
    async post(url, data, token) {
        var result = await super.post(url, data, this.getHeader(token));
        return this.handleResult(result)
    }
    async put(url, data, token) {
        var result = await super.put(url, data, this.getHeader(token));
        return this.handleResult(result)
    }
    async del(url, data, token) {
        var result = await super.del(url, data, this.getHeader(token));
        return this.handleResult(result)
    }
}
module.exports = Square
