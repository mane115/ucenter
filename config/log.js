module.exports = {
  appenders: [{
    type: 'console'
  }, {
    type: 'dateFile',
    filename: 'logs/auth',
    category: 'auth',
    pattern: "-yyyy-MM-dd.log",
    alwaysIncludePattern: true
  }, {
    type: 'dateFile',
    filename: 'logs/auth',
    category: 'user',
    pattern: "-yyyy-MM-dd.log",
    alwaysIncludePattern: true
  }, {
    type: 'dateFile',
    filename: 'logs/oauth',
    category: 'oauth',
    pattern: "-yyyy-MM-dd.log",
    alwaysIncludePattern: true
  }, {
    type: 'file',
    filename: 'logs/common.log',
    category: 'common',
    maxLogSize: 20480,
    backups: 3
  }, {
    type: "logLevelFilter",
    level: "ERROR",
    appender: {
      type: "file",
      filename: "logs/errors.log"
    }
  }, {
    type: "logLevelFilter",
    level: "WARN",
    appender: {
      type: "file",
      filename: "logs/warn.log"
    }
  }]
}
