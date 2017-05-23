var STATUS = require('../../common/const').STATUS;
var util = require('../../util');

exports = module.exports = function(conn, mongoose) {
    var users = new mongoose.Schema({
        name: String,
        mobile: String,
        apps: [String],
        status: {
            type: Number,
            default: STATUS.USER.ACTIVE
        },
        create_at: {
            type: Date,
            default: Date.now
        },
        chance: {
            type: Number,
            default: util.getRandom
        },
        oauth: [
            {
                _id: false,
                platform: String,
                platform_user_id: String,
                platform_user_name: String,
                email: String,
                avatar: String,
                status: {
                    type: Number,
                    default: STATUS.USER.ACTIVE
                },
                bind_at: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    });
    users.index({create_at: -1});
    users.index({name: 1});
    users.index({mobile: 1});
    users.index({
        'oauth.platform': 1,
        'oauth.platform_user_id': 1
    }, {unique: true});
    conn.model('users', users);
}
