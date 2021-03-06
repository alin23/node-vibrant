"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Url = require("url");
function isRelativeUrl(url) {
    var u = Url.parse(url);
    return u.protocol === null
        && u.host === null
        && u.port === null;
}
function isSameOrigin(a, b) {
    var ua = Url.parse(a);
    var ub = Url.parse(b);
    // https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
    return ua.protocol === ub.protocol
        && ua.hostname === ub.hostname
        && ua.port === ub.port;
}
var BroswerImage = /** @class */ (function (_super) {
    __extends(BroswerImage, _super);
    function BroswerImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BroswerImage.prototype._initCanvas = function () {
        var img = this.image;
        var canvas = this._canvas = document.createElement('canvas');
        var context = this._context = canvas.getContext('2d');
        canvas.className = 'vibrant-canvas';
        canvas.style.display = 'none';
        this._width = canvas.width = img.width;
        this._height = canvas.height = img.height;
        context.drawImage(img, 0, 0);
        document.body.appendChild(canvas);
    };
    BroswerImage.prototype.load = function (image) {
        var _this = this;
        var img = null;
        var src = null;
        if (typeof image === 'string') {
            img = document.createElement('img');
            src = image;
        }
        else if (image instanceof HTMLImageElement) {
            img = image;
            src = image.src;
        }
        else {
            return Promise.reject(new Error("Cannot load buffer as an image in browser"));
        }
        this.image = img;
        if (!isRelativeUrl(src) && !isSameOrigin(window.location.href, src)) {
            img.crossOrigin = 'anonymous';
        }
        if (typeof image === 'string') {
            img.src = src;
        }
        return new Promise(function (resolve, reject) {
            var onImageLoad = function () {
                _this._initCanvas();
                resolve(_this);
            };
            if (img.complete) {
                // Already loaded
                onImageLoad();
            }
            else {
                img.onload = onImageLoad;
                img.onerror = function (e) { return reject(new Error("Fail to load image: " + src)); };
            }
        });
    };
    BroswerImage.prototype.clear = function () {
        this._context.clearRect(0, 0, this._width, this._height);
    };
    BroswerImage.prototype.update = function (imageData) {
        this._context.putImageData(imageData, 0, 0);
    };
    BroswerImage.prototype.getWidth = function () {
        return this._width;
    };
    BroswerImage.prototype.getHeight = function () {
        return this._height;
    };
    BroswerImage.prototype.resize = function (targetWidth, targetHeight, ratio) {
        var _a = this, canvas = _a._canvas, context = _a._context, img = _a.image;
        this._width = canvas.width = targetWidth;
        this._height = canvas.height = targetHeight;
        context.scale(ratio, ratio);
        context.drawImage(img, 0, 0);
    };
    BroswerImage.prototype.getPixelCount = function () {
        return this._width * this._height;
    };
    BroswerImage.prototype.getImageData = function () {
        return this._context.getImageData(0, 0, this._width, this._height);
    };
    BroswerImage.prototype.remove = function () {
        this._canvas.parentNode.removeChild(this._canvas);
    };
    return BroswerImage;
}(base_1.ImageBase));
exports.default = BroswerImage;
//# sourceMappingURL=browser.js.map