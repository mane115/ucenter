var STATUS = require('../../common/const').STATUS;
var util = require('../../util');

exports = module.exports = function(conn, mongoose) {
    var users = new mongoose.Schema({
        // short_id: Number,
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
        }
    });
    users.index({create_at: -1});
    users.index({name: 1});
    users.index({mobile: 1});
    // users.index({short_id: 1});
    conn.model('users', users);
}
