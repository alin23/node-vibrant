"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./common/data");
var helper_1 = require("./common/helper");
var server_1 = require("./common/server");
var data_2 = require("./common/data");
var Vibrant = require("../");
describe('Palette Extraction', function () {
    describe('process samples', function () {
        return data_2.SAMPLES.forEach(function (sample) {
            it(sample.fileName + " (callback)", function (done) { return helper_1.testVibrant(Vibrant, sample, done); });
            it(sample.fileName + " (Promise)", function () { return helper_1.testVibrantAsPromised(Vibrant, sample); });
        });
    });
    describe('process samples (no filters)', function () {
        return data_2.SAMPLES.forEach(function (sample) {
            var builderCallback = function (builder) { return builder.clearFilters(); };
            it(sample.fileName + " (callback)", function (done) { return helper_1.testVibrant(Vibrant, sample, done, 'filePath', builderCallback, data_1.REFERENCE_PALETTE); });
            it(sample.fileName + " (Promise)", function () { return helper_1.testVibrantAsPromised(Vibrant, sample, 'filePath', builderCallback, data_1.REFERENCE_PALETTE); });
        });
    });
    describe('process remote images (http)', function () {
        var server = null;
        before(function (done) {
            server = server_1.createSampleServer();
            return server.listen(data_2.TEST_PORT, done);
        });
        after(function (done) { return server.close(done); });
        data_2.SAMPLES.forEach(function (sample) {
            it(sample.url + " (callback)", function (done) { return helper_1.testVibrant(Vibrant, sample, done); });
            it(sample.url + " (Promise)", function () { return helper_1.testVibrantAsPromised(Vibrant, sample); });
        });
    });
});
//# sourceMappingURL=vibrant.spec.js.map