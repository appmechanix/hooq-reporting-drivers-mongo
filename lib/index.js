var config = require('config');
var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var engine = {};

engine.LogSchema = null;

engine.setup = function (schema) {
    engine.LogSchema = schema;
};

engine.getData = function (startDate, endDate, filter, callback) {
    if (engine.LogSchema === null) {
        throw new Error("Log schema not set. Call setup first.");
    }

    engine.LogSchema.aggregate([
        {
            $match: { Created: { $gte: startDate, $lte: endDate }, UserId: filter.UserId }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$Created" },
                    month: { $month: "$Created" },
                    day: { $dayOfMonth: "$Created" }
                },
                hits: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ], function (err, data) {
        if (err) {
            callback(err);
            return;
        }

        var result = [];
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            result.push({
                date: new Date(d._id.year, d._id.month - 1, d._id.day),
                value: d.hits
            });
        }

        callback(null, result);
    });
};

module.exports = engine;