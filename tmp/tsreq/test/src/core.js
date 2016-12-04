"use strict";
var Core = (function () {
    function Core() {
        this.log = function () {
            console.log("Hello! Node.js × TypeScript from Core Class");
        };
    }
    Core.prototype.test = function () {
        return "test";
    };
    /**
     *
     */
    Core.prototype.hello = function (name) {
        return "hello " + name;
    };
    return Core;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Core;
