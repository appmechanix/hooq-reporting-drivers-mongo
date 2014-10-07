var config = require('config');
var mongoose = require('mongoose');

var driver = require('../lib/index');

exports.checkThatDataIsReturned = function (test) {
    mongoose.connect(config.Mongo.ConnectionString);
    driver.getData(new Date(2014, 01, 01), new Date(2014, 12, 31), function (err, data) {
        test.ok(data);
        test.notEqual(0, data.length);
        test.done();
        mongoose.disconnect();
    });
};

exports.checkThatDataIsReturnedForMonth = function (test) {
    mongoose.connect(config.Mongo.ConnectionString);
    driver.getData(new Date(2014, 09, 01), new Date(2014, 09, 31), function (err, data) {
        test.ok(data);
        test.equal(4, data.length);
        test.done();
        mongoose.disconnect();
    });
};
