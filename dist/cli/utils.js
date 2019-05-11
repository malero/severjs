"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function touchDirectories(directories) {
    for (var _i = 0, directories_1 = directories; _i < directories_1.length; _i++) {
        var dir = directories_1[_i];
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}
exports.touchDirectories = touchDirectories;
//# sourceMappingURL=utils.js.map