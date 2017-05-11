const Router = require('koa-router'),
    adminCtr = require('../controller/admin'),
    filter = require('../midware/filter/admin'),
    router = new Router();
router.get('/app', adminCtr.getApp);
router.get('/app/:app', adminCtr.getApp);
router.post('/app', filter.addApp, adminCtr.addApp);
module.exports = router;
