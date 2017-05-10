const Router = require('koa-router'),
    config = require('../config'),
    userCtr = require('../controller/user'),
    authMid = require('../midware/auth'),
    filter = require('../midware/filter/user'),
    router = new Router();
// router.post('/', filter.create, userCtr.create);
router.get('/profile', authMid.getTokenInfo, userCtr.getInfo);
router.post('/password', filter.resetPassword, authMid.verifySMS(config.smsType.reset.name), userCtr.resetPassword);
router.put('/password', filter.updatePassword, authMid.getTokenInfo, userCtr.updatePassword);
module.exports = router;
