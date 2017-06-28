let env = process.env
module.exports = {
  port: 3004,
  baseUrl: '/api/v1',
  session: {
    key: 'HANDSOMEGH',
    age: 24 * 60 * 60 * 1000
  },
  password: {
    saltTimes: 10
  },
  backdoorCode: 'handsomegh',
  expire: {
    accessToken: 7 * 24 * 60 * 60,
    refreshToken: 30 * 24 * 60 * 60,
    smsCode: 24 * 60 * 60
  },
  smsType: {
    signup: {
      //sms template code
      name: 'signup'
    },
    reset: {
      name: 'reset'
    }
  },
  database: {
    redis: {
      library: env.REDIS_DB || 0,
      port: 6379,
      host: '127.0.0.1',
      url: env.REDIS_URL || 'redis://127.0.0.1:6379',
      pwd: env.REDIS_PWD || ''
    },
    mysql: {
      connectionLimit: 100,
      getConnection: 100,
      host: '127.0.0.1',
      user: 'root',
      password: 'password',
      database: 'user',
      charset: 'utf8mb4',
      multipleStatements: true, //允许一条query可以包含多条sql语句
    },
    mongo: {
      url: 'mongodb://127.0.0.1:27017/ucenter'
    }
  },
  log: {
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
  },
  qiniu: {
    ACCESS_KEY: '',
    SECRET_KEY: '',
    bucket: '',
    baseUrl: '',
    path: {
      user: '/user'
    }
  }
}
