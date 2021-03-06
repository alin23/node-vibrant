"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var chai_1 = require("chai");
var util = require("../../util");
var data_1 = require("./data");
var table_1 = require("table");
var TABLE_OPTS = {
    border: table_1.getBorderCharacters('void')
};
var TABLE_HEADER = (_a = ['Swatch', 'Actual']).concat.apply(_a, data_1.TARGETS.map(function (t) { return [t, 'Status']; }));
var displayColorDiffTable = function (p, diff) {
    console.log("Palette Diffrence of " + p);
    diff.unshift(TABLE_HEADER);
    console.log(table_1.table(diff, TABLE_OPTS));
};
var paletteCallback = function (references, sample, done) {
    return function (err, palette) {
        if (err != null) {
            throw err;
        }
        chai_1.expect(palette, 'palette should be returned').not.to.be.null;
        var failCount = 0;
        var testWithTarget = function (name, actual, target) {
            var key = sample.i.toString();
            var expected = references[target][key][name];
            var result = {
                target: target,
                expected: expected != null ? expected : 'null',
                status: 'N/A',
                diff: -1
            };
            if (expected === null) {
                if (actual !== null) {
                    console.warn("WARN: " + name + " color form '" + target + "' was not expected. Got " + actual.getHex());
                }
                // expect(actual, `${name} color form '${target}' was not expected`).to.be.null
            }
            else {
                chai_1.expect(actual, name + " color from '" + target + "' was expected").not.to.be.null;
                var actualHex = actual.getHex();
                var diff = util.hexDiff(actualHex, expected);
                result.diff = diff;
                result.status = util.getColorDiffStatus(diff);
                if (diff > util.DELTAE94_DIFF_STATUS.SIMILAR) {
                    failCount++;
                }
            }
            return result;
        };
        var diffTable = [];
        for (var name_1 in palette) {
            var left;
            var actual = palette[name_1];
            var colorDiff = [name_1, (left = (actual != null ? actual.getHex() : undefined)) != null ? left : 'null'];
            for (var _i = 0, TARGETS_1 = data_1.TARGETS; _i < TARGETS_1.length; _i++) {
                var target = TARGETS_1[_i];
                var r = testWithTarget(name_1, actual, target);
                colorDiff.push(r.expected);
                colorDiff.push(r.status + "(" + r.diff.toPrecision(2) + ")");
            }
            diffTable.push(colorDiff);
        }
        displayColorDiffTable(sample.filePath, diffTable);
        chai_1.expect(failCount, failCount + " colors are too diffrent from reference palettes")
            .to.equal(0);
        if (typeof done === 'function')
            done();
    };
};
exports.testVibrant = function (Vibrant, sample, done, pathKey, builderCallback, references) {
    if (pathKey === void 0) { pathKey = 'filePath'; }
    if (builderCallback === void 0) { builderCallback = null; }
    if (references === void 0) { references = data_1.REFERENCE_PALETTE_WITH_FILTER; }
    var builder = Vibrant.from(sample[pathKey])
        .quality(1);
    if (typeof builderCallback === 'function')
        builder = builderCallback(builder);
    builder.getPalette(paletteCallback(references, sample, done));
};
exports.testVibrantAsPromised = function (Vibrant, sample, pathKey, builderCallback, references) {
    if (pathKey === void 0) { pathKey = 'filePath'; }
    if (builderCallback === void 0) { builderCallback = null; }
    if (references === void 0) { references = data_1.REFERENCE_PALETTE_WITH_FILTER; }
    var cb = paletteCallback(references, sample);
    var builder = Vibrant.from(sample[pathKey])
        .quality(1);
    if (typeof builderCallback === 'function')
        builder = builderCallback(builder);
    builder.getPalette()
        .then(function (palette) { return cb(null, palette); })
        .catch(function (e) { return cb(e); });
};
//# sourceMappingURL=helper.js.map