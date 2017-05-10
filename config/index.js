var ENV = process.env.NODE_ENV || 'dev';
var config = require(`./config.${ENV}.js`);
module.exports = config;
