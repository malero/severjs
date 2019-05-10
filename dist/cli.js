#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var shell = require("shelljs");
for (var j = 0; j < process.argv.length; j++) {
    console.log(j + ": " + process.argv[j]);
}
var lambdaRegex = /([^\.]+)\.lambda\.ts$/;
var lambdas = [];
var dir = "./build/";
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
var items = fs.readdirSync('./src');
for (var i = 0; i < items.length; i++) {
    var match = lambdaRegex.exec(items[i]);
    if (match)
        console.log('Match?', items[i], match[1]);
    if (match)
        lambdas.push(match[1]);
}
for (var _i = 0, lambdas_1 = lambdas; _i < lambdas_1.length; _i++) {
    var lambda = lambdas_1[_i];
    var dir_1 = "./build/" + lambda + "/";
    if (!fs.existsSync(dir_1)) {
        fs.mkdirSync(dir_1);
    }
    console.log("Creating lambda function " + lambda + ".");
    fs.writeFileSync("./build/" + lambda + "/main.ts", "\n        import { ILambdaEvent, ILambdaContext, ILambdaCallback } from \"severjs\";\n        import { " + lambda + " } from \"./" + lambda + ".lambda\";\n\n        export function dispatch(event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback): void {\n        new " + lambda + "(event, context, callback);\n        }\n    ");
    fs.copyFileSync("./src/" + lambda + ".lambda.ts", "./build/" + lambda + "/" + lambda + ".lambda.ts");
    shell.exec("tsc ./build/" + lambda + "/main.ts --outFile ./build/" + lambda + "/main.js");
}
//# sourceMappingURL=cli.js.map