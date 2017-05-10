// var rp = require('request-promise');
var request = require('request');
var Promise = require('bluebird');
var _ = require('lodash');
class Proxy {
    constructor(option) {
        if (option.target) {
            this.target = option.target
        }
        if (option.apiProxyPath && _.isArray(option.apiProxyPath)) {
            this.apiProxyPath = option.apiProxyPath;
        }
        if (option.onReq && typeof option.onReq === 'function') {
            this.onReq = option.onReq;
        }
        if (option.onRes && typeof option.onRes === 'function') {
            this.onRes = option.onRes;
        }
        if (option.onErr && typeof option.onErr === 'function') {
            this.onErr = option.onErr;
        }
        this._filterProxyPath = function(url) {
            var test = false;
            if (!this.apiProxyPath || this.apiProxyPath.length === 0) {
                return this.target + url
            }
            this.apiProxyPath.forEach(path => {
                if (RegExp(path).test(url)) {
                    test = true;
                }
            })
            return test
                ? this.target + url
                : test;
        }
        this._parseJSON = function(string) {
            try {
                string = JSON.parse(string);
            } catch (err) {} finally {
                return string;
            }
        }
    }
    handle(req, res, next) {
        var url = this._filterProxyPath(req.url);
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
            console.log(option)
            return new Promise((success, fail) => {
                request(option, (err, res, body) => {
                    if (err) {
                        return fail(err)
                    }
                    if (!req.session.xSession) {
                      console.log('here')
                        let cookie = res.headers['set-cookie'];
                        req.session.xSession = cookie;
                    }
                    return success(this._parseJSON(body));
                })
            })
        };
        var handleError = err => {
            if (this.onErr) {
                return onErr(err, req, res, next)
            } else {
                return console.log(err)
            }
        };
        var handleBefore = () => {
            if (this.onReq) {
                return this.onReq(option, req, res)
            } else {
                return Promise.resolve();
            }
        };
        var handleAfter = data => {
            if (this.onRes) {
                return this.onRes(data, req, res).then(result => data);
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
module.exports = Proxy;
