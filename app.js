var Koa = require('koa'),
    redisStore = require('koa-redis'),
    log4js = require('log4js'),
    session = require('koa-session-minimal'),
    static = require('koa-static'),
    bodyParser = require('koa-bodyparser'),
    config = require('./config'),
    util = require('./util'),
    app = new Koa(),
    model = {
        mongo: require('./model/mongo')
    };

var initLogger = function(log4js) {
    log4js.configure(config.log);
    var logger = log4js.getLogger('common');
    global.logger = logger;
};
var initMidware = function(app) {
    var router = require('./router');
    var redisStoreOption = {
        host: config.database.redis.host,
        port: config.database.redis.port
    };
    if (config.database.redis.pwd) {
        redisStoreOption.auth_pass = config.database.redis.pwd
    }
    if (config.database.redis.library || config.database.redis.library === 0) {
        redisStoreOption.db = config.database.redis.library
    }
    var sessionOption = {
        store: redisStore(redisStoreOption),
        key: config.session.key,
        cookie: {
            maxAge: config.session.age
        }
    };
    app.use(bodyParser()).use(session(sessionOption)).use(router.routes()).use(router.allowedMethods());
    console.log('init midware success');
    return Promise.resolve();
};
var initServer = async function(app) {
    try {
        await initLogger(log4js);
        await model.mongo.init();
        await util.initRedis();
        await initMidware(app);
        app.listen(config.port);
        app.on('error', err => logger.error(`server error ${err}`, err));
        logger.info(`init server success port:${config.port}`);
    } catch (err) {
        logger.error(err)
    }
};
initServer(app)
