const Router = require('koa-router'),
    config = require('../config'),
    util = require('../util'),
    log = require('../midware/log'),
    authMid = require('../midware/auth'),
    user = require('./user'),
    oauth = require('./oauth'),
    admin = require('./admin'),
    publicRouter = require('./public'),
    router = new Router({prefix: config.baseUrl});

router.use('/*', util.handleResponse);
router.use('/oauth', authMid.verifyApp, log.oauth, oauth.routes(), oauth.allowedMethods());
router.use('/admin', log.admin, admin.routes(), admin.allowedMethods());
router.use('/user', authMid.verifyApp, log.user, user.routes(), user.allowedMethods());
router.use('/public', authMid.verifyApp, log.common, publicRouter.routes(), publicRouter.allowedMethods());
module.exports = router
