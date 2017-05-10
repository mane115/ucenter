exports = module.exports = function(conn, mongoose) {
    var logs = new mongoose.Schema({
        user_id: String,
        app_id: String,
        content: String,
        create_at: {
            type: Date,
            default: Date.now
        },
        is_admin: {
            type: Boolean,
            default: false
        }
    });
    conn.model('logs', logs);
}
