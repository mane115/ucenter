let env = process.env
module.exports = {
  port: env.PROT || 3004,
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
      url: env.REDIS_PORT || 'redis://127.0.0.1:6379',
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
      url: env.MONGO_PORT || 'mongodb://127.0.0.1:27017/ucenter'
    }
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
