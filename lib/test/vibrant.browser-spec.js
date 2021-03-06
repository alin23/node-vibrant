"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expect = window.chai.expect;
var Vibrant = window.Vibrant;
var data_1 = require("./common/data");
var helper_1 = require("./common/helper");
describe('Vibrant', function () {
    it('Async import', function () {
        return Promise.resolve().then(function () { return require('../browser'); }).then(function (v) {
            expect(v, 'Vibrant').not.to.be.undefined;
            expect(v.Util, 'Vibrant.Util').not.to.be.undefined;
            expect(v.Quantizer, 'Vibrant.Quantizer').not.to.be.undefined;
            expect(v.Generator, 'Vibrant.Generator').not.to.be.undefined;
            expect(v.Filter, 'Vibrant.Filter').not.to.be.undefined;
        });
    });
    it('exports to window', function () {
        expect(Vibrant, 'Vibrant').not.to.be.undefined;
        expect(Vibrant.Util, 'Vibrant.Util').not.to.be.undefined;
        expect(Vibrant.Quantizer, 'Vibrant.Quantizer').not.to.be.undefined;
        expect(Vibrant.Generator, 'Vibrant.Generator').not.to.be.undefined;
        expect(Vibrant.Filter, 'Vibrant.Filter').not.to.be.undefined;
    });
    describe('Palette Extraction', function () {
        data_1.SAMPLES.forEach(function (example) {
            it(example.fileName + " (callback)", function (done) { return helper_1.testVibrant(Vibrant, example, done, 'relativeUrl'); });
            it(example.fileName + " (Promise)", function () { return helper_1.testVibrantAsPromised(Vibrant, example, 'relativeUrl'); });
        });
    });
    describe('Browser Image', function () {
        var loc = window.location;
        var BrowserImage = Vibrant.DefaultOpts.ImageClass;
        var CROS_URL = 'https://avatars3.githubusercontent.com/u/922715?v=3&s=460';
        var RELATIVE_URL = 'base/data/1.jpg';
        var SAME_ORIGIN_URL = loc.protocol + "//" + loc.host + "/" + RELATIVE_URL;
        it('should set crossOrigin flag for images form foreign origin', function () {
            return new BrowserImage().load(CROS_URL)
                .then(function (m) {
                expect(m.image.crossOrigin, CROS_URL + " should have crossOrigin === 'anonymous'")
                    .to.equal('anonymous');
                expect(m.getImageData()).to.be.an.instanceOf(ImageData);
            });
        });
        it('should not set crossOrigin flag for images from same origin (relative URL)', function () {
            return new BrowserImage().load(RELATIVE_URL)
                .then(function (m) {
                expect(m.image.crossOrigin, RELATIVE_URL + " should not have crossOrigin set")
                    .not.to.equal('anonymous');
            });
        });
        it('should not set crossOrigin flag for images from same origin (absolute URL)', function () {
            return new BrowserImage().load(SAME_ORIGIN_URL)
                .then(function (m) {
                expect(m.image.crossOrigin, SAME_ORIGIN_URL + " should not have crossOrigin set")
                    .not.to.equal('anonymous');
            });
        });
        it('should accept HTMLImageElement as input', function () {
            var img = document.createElement('img');
            img.src = data_1.SAMPLES[0].relativeUrl;
            var m1 = new BrowserImage();
            return m1.load(img);
        });
        it('should accept HTMLImageElement that is already loaded as input', function (done) {
            var img = document.createElement('img');
            img.src = data_1.SAMPLES[0].relativeUrl;
            img.onload = function () {
                var m1 = new BrowserImage();
                m1.load(img)
                    .then(function (img) { return done(); });
            };
        });
    });
});
//# sourceMappingURL=vibrant.browser-spec.js.map