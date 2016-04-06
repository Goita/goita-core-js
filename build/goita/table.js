"use strict";
var goita;
(function (goita) {
    var table = (function () {
        function table() {
            this.log = function () {
                console.log("Hello! Node.js × TypeScript from Class");
            };
        }
        return table;
    }());
    goita.table = table;
})(goita = exports.goita || (exports.goita = {}));
//# sourceMappingURL=table.js.map