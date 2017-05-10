exports = module.exports = function(conn, mongoose) {
    var tokens = new mongoose.Schema({
        user_id: String,
        app_id: String,
        access_token: String,
        refresh_token: String,
        access_expire_at: {
            type: Date,
            default: Date.now
        },
        refresh_expire_at: {
            type: Date,
            default: Date.now
        },
        platform: {
            type: String,
            default: 'default'
        }
    });
    tokens.index({app_id: 1, user_id: 1});
    conn.model('tokens', tokens);
}
