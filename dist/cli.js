#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var archiver = require("archiver");
var fs = require("fs");
var shell = require("shelljs");
var aws = require("aws-sdk");
// Load credentials and set region from JSON file
aws.config.loadFromPath('./aws.json');
for (var j = 0; j < process.argv.length; j++) {
    console.log(j + ": " + process.argv[j]);
}
var lambdaRegex = /([^\.]+)\.lambda\.ts$/;
var lambdas = [];
function touchDirectories(directories) {
    for (var _i = 0, directories_1 = directories; _i < directories_1.length; _i++) {
        var dir = directories_1[_i];
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}
var directories = [
    "./build/",
    "./dist/",
];
touchDirectories(directories);
var items = fs.readdirSync('./src');
for (var i = 0; i < items.length; i++) {
    var match = lambdaRegex.exec(items[i]);
    if (match)
        lambdas.push(match[1]);
}
for (var _i = 0, lambdas_1 = lambdas; _i < lambdas_1.length; _i++) {
    var lambda = lambdas_1[_i];
    directories = [
        "./build/" + lambda + "/",
        "./dist/" + lambda + "/",
    ];
    touchDirectories(directories);
    console.log("Creating lambda function " + lambda + ".");
    fs.writeFileSync("./build/" + lambda + "/main.ts", "\n        import { ILambdaEvent, ILambdaContext, ILambdaCallback } from \"severjs\";\n        import { " + lambda + " } from \"./" + lambda + ".lambda\";\n\n        export function dispatch(event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback): void {\n        new " + lambda + "(event, context, callback);\n        }\n    ");
    fs.copyFileSync("./src/" + lambda + ".lambda.ts", "./build/" + lambda + "/" + lambda + ".lambda.ts");
    shell.exec("tsc ./build/" + lambda + "/main.ts --outDir ./dist/" + lambda + "/");
    var output = fs.createWriteStream("./dist/" + lambda + "/" + lambda + ".zip");
    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.glob("*.js", {
        cwd: "./dist/" + lambda + "/"
    });
    archive.finalize();
}
//# sourceMappingURL=cli.js.map