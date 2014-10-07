var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var engine = {};

// SCHEMAS
var logSchema = mongoose.Schema({
    UserId: String,
    WebhookId: String,
    Created: { type: Date, default: Date.now },
    RemoteIp: String,
    Method: String,
    Size: Number,
    UserAgent: String,
    ContentType: String,
    Headers: [String]
});

var Log = mongoose.model('Logs', logSchema);

engine.getData = function (startDate, endDate, callback) {
    Log.aggregate([
        {
            $match: {Created: {$gte: startDate, $lte: endDate}}
        },
        {
            $group: {
                _id: {
                    year: {$year: "$Created"},
                    month: {$month: "$Created"},
                    day: {$dayOfMonth: "$Created"}
                },
                hits: {$sum: 1}
            }
        },
        {$sort: {"_id.year": 1, "_id.month": 1, "_id.day": 1}}
    ], callback);
};

module.exports = engine;