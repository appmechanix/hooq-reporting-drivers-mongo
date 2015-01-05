var config = require('config');
var mongoose = require('mongoose');

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


exports.checkThatErrorIsThrownWhenNoDriver = function (test) {
    test.throws(function () {
        driver.getData(new Date(2014, 01, 01), new Date(2014, 12, 31), function () { });
    }, Error);

    test.done();
}

exports.checkThatDataIsReturned = function (test) {
    mongoose.connect(config.Mongo.ConnectionString);

    var driver = require('../lib/index');
    driver.setup(Log);

    driver.getData(new Date(2014, 01, 01), new Date(2014, 12, 31), function (err, data) {
        test.ok(data);
        test.notEqual(0, data.length);
        test.done();
        mongoose.disconnect();
    });
};

exports.checkThatDataIsReturnedForMonth = function (test) {
    mongoose.connect(config.Mongo.ConnectionString);

    var driver = require('../lib/index');
    driver.setup(Log);

    driver.getData(new Date(2014, 09, 01), new Date(2014, 09, 31), function (err, data) {
        test.ok(data);
        test.equal(4, data.length);
        test.done();
        mongoose.disconnect();
    });
};
