const Router = require('koa-router'),
    authMid = require('../midware/auth'),
    filter = require('../midware/filter/public'),
    router = new Router();
// router.post('/verify/sms/:type', filter.smsType, authMid.verifySMS);
router.post('/sms/:type', filter.sendSMS, authMid.sendSMS);
module.exports = router;
