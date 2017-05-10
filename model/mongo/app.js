var STATUS = require('../../common/const').STATUS;
exports = module.exports = function(conn, mongoose) {
    var apps = new mongoose.Schema({
        app_id: String,
        user_id: String,
        password: String,
        status: {
            type: Number,
            default: STATUS.USER.ACTIVE
        },
        create_at: {
            type: Date,
            default: Date.now
        },
        update_at: {
            type: Date,
            default: Date.now
        },
        last_login: {
            type: Date,
            default: Date.now
        },
        last_refresh: {
            type: Date,
            default: Date.now
        },
        login_times: {
            type: Number,
            min: 1,
            default: 1
        }
    });
    apps.index({app_id: 1, user_id: 1});
    conn.model('apps', apps);
}
