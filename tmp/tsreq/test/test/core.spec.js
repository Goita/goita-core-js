"use strict";
/// <reference path="../typings/index.d.ts" />
var exports_1 = require("../src/exports");
var Chai = require("chai");
describe('Core', function () {
    var core;
    beforeEach(function () {
        core = new exports_1.Core();
    });
    describe('#hello', function () {
        it("should return hello and given name", function () {
            Chai.expect(core.hello("test")).to.be("hello test");
        });
    });
});
