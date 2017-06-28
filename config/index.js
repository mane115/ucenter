let env = process.env;
let NODE_ENV = env.NODE_ENV || 'dev';
let config = require(`./config.${NODE_ENV}.js`);
config.database.redis.url = config.database.redis.url.replace('tcp', 'redis')
config.database.mongo.url = config.database.mongo.url.replace('tcp', 'mongodb')
module.exports = config;
