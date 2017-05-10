module.exports = {
    OAUTH: {
        PASSWORD_ERROR: {
            code: 1001,
            message: 'invalid password'
        }
    },
    AUTH: {
        VERSION: {
            code: 1101,
            message: 'invalid version'
        },
        APP: {
            code: 1102,
            message: 'invalid request'
        },
        UNAUTH: {
            code: 1103,
            message: 'auth fail'
        },
        RE_SIGNIN: {
            code: 1104,
            message: 'please sign in'
        },
        SMS: {
            code: 1105,
            message: 'invalid sms code'
        }
    },
    USER: {
        DUPLICATE_NAME: {
            code: 2001,
            message: 'user name exist'
        },
        EXIST: {
            code: 2002,
            message: 'user exist'
        },
        NOT_EXIST: {
            code: 2003,
            message: 'user not exist'
        },
        NOT_ACTIVE: {
            code: 2003,
            message: 'user not active'
        },
        SAME_PASSWORD: {
            code: 2004,
            message: 'new password can not the same as old password'
        }
    },
    ADMIN: {
        APP_EXIST: {
            code: 7001,
            message: 'app exist'
        }

    },
    DATA: {
        REQUIRE: (params = 'params') => {
            var message = `${params} require`;
            return {code: 8002, message: message}
        },
        INVALID_DATA: (data = 'data') => {
            var message = `invalid ${data}`
            return {code: 8003, message: message}
        }
    },
    SERVER: {
        MONGO: {
            code: 9001,
            massage: 'The server is extremely busy at the moment, please send it again.'
        },
        COMMON: {
            code: 9002,
            massage: 'The server is extremely busy at the moment, please send it again.'
        }
    }
}
