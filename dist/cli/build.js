"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var shell = require("shelljs");
var archiver = require("archiver");
var utils_1 = require("./utils");
function discoverLambdaFunctions() {
    var lambdaRegex = /([^\.]+)\.lambda\.ts$/;
    var lambdas = [];
    var directories = [
        "./build/",
        "./dist/",
    ];
    utils_1.touchDirectories(directories);
    var items = fs.readdirSync('./src');
    for (var i = 0; i < items.length; i++) {
        var match = lambdaRegex.exec(items[i]);
        if (match)
            lambdas.push(match[1]);
    }
    return lambdas;
}
exports.discoverLambdaFunctions = discoverLambdaFunctions;
function buildLambda(lambda) {
    var directories = [
        "./build/" + lambda + "/",
        "./dist/" + lambda + "/",
    ];
    utils_1.touchDirectories(directories);
    console.log("Building lambda function " + lambda + ".");
    fs.writeFileSync("./build/" + lambda + "/main.ts", "\n        import { ILambdaEvent, ILambdaContext, ILambdaCallback } from \"severjs\";\n        import { " + lambda + " } from \"./" + lambda + ".lambda\";\n\n        export function dispatch(event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback): void {\n        new " + lambda + "(event, context, callback);\n        }\n    ");
    fs.copyFileSync("./src/" + lambda + ".lambda.ts", "./build/" + lambda + "/" + lambda + ".lambda.ts");
    shell.exec("tsc ./build/" + lambda + "/main.ts --outDir ./dist/" + lambda + "/");
    var output = fs.createWriteStream("./dist/" + lambda + "/" + lambda + ".zip");
    var archive = archiver('zip', {
        zlib: { level: 5 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.glob("*.js", {
        cwd: "./dist/" + lambda + "/",
        root: ''
    });
    archive.finalize();
}
exports.buildLambda = buildLambda;
//# sourceMappingURL=build.js.map