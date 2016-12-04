"use strict";
var Player = (function () {
    function Player() {
        var _this = this;
        this.tegoma = new Array();
        /* public field */
        this.field = new Array();
        /* private field */
        this._field = new Array();
        /**
         *
         */
        this.hasKoma = function (koma) {
            return _this.tegoma.indexOf(koma) >= 0;
        };
    }
    return Player;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Player;
