"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Lambda = /** @class */ (function () {
    function Lambda(event, context, callback) {
        this.event = event;
        this.context = context;
        this.callback = callback;
        switch (event.httpMethod) {
            case constants_1.EHttpMethod.GET:
                this.get();
                break;
            case constants_1.EHttpMethod.POST:
                this.post();
                break;
            case constants_1.EHttpMethod.PUT:
                this.put();
                break;
            case constants_1.EHttpMethod.DELETE:
                this.delete();
                break;
            case constants_1.EHttpMethod.HEAD:
                this.head();
                break;
            case constants_1.EHttpMethod.PATCH:
                this.patch();
                break;
            default:
                this.test();
                break;
        }
    }
    Lambda.prototype.get = function () {
        this.renderError('Not Implemented.');
    };
    Lambda.prototype.put = function () {
        this.renderError('Not Implemented.');
    };
    Lambda.prototype.post = function () {
        this.renderError('Not Implemented.');
    };
    Lambda.prototype.delete = function () {
        this.renderError('Not Implemented.');
    };
    Lambda.prototype.options = function () {
        this.renderError('Not Implemented.');
    };
    Lambda.prototype.head = function () {
        this.renderError('Not Implemented.');
    };
    Lambda.prototype.patch = function () {
        this.renderError('Not Implemented.');
    };
    Lambda.prototype.test = function () {
        this.renderError('Not Implemented.');
    };
    Lambda.prototype.render = function (data, statusCode, headers) {
        if (statusCode === void 0) { statusCode = 200; }
        if (headers === void 0) { headers = {}; }
        this.callback(undefined, {
            statusCode: statusCode,
            headers: headers,
            body: JSON.stringify(data),
            isBase64Encoded: false
        });
    };
    Lambda.prototype.renderError = function (error) {
        this.callback(error);
    };
    return Lambda;
}());
exports.Lambda = Lambda;
//# sourceMappingURL=Lambda.js.map