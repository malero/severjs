#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws = require("aws-sdk");
var fs = require("fs");
var shell = require("shelljs");
var archiver = require("archiver");
function touchDirectories(directories) {
    for (var _i = 0, directories_1 = directories; _i < directories_1.length; _i++) {
        var dir = directories_1[_i];
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}
function publishLambda(lambda) {
    var awsLambda = new aws.Lambda({
        apiVersion: '2015-03-31',
        region: 'us-west-2'
    });
    var params = {
        FunctionName: lambda,
        Code: {
            ZipFile: fs.readFileSync("./dist/" + lambda + "/" + lambda + ".zip")
        },
        Handler: "main.dispatch",
        Role: process.env.LAMBDA_ROLE,
        Runtime: "nodejs8.10",
        MemorySize: 128,
        Publish: true
    };
    awsLambda.deleteFunction({ FunctionName: lambda }, function (data) {
        console.log(data);
    });
    awsLambda.createFunction(params, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('function created');
        }
    });
}
function discoverLambdaFunctions() {
    var lambdaRegex = /([^\.]+)\.lambda\.ts$/;
    var lambdas = [];
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
    return lambdas;
}
function buildLambda(lambda) {
    var directories = [
        "./build/" + lambda + "/",
        "./dist/" + lambda + "/",
    ];
    touchDirectories(directories);
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
// Load credentials and set region from JSON file
aws.config.loadFromPath('./aws.json');
if (process.argv.length == 2) {
}
else if (process.argv[2] === 'build') {
    if (process.argv.length >= 4) {
        buildLambda(process.argv[3]);
    }
    else {
        var lambdas = discoverLambdaFunctions();
        for (var _i = 0, lambdas_1 = lambdas; _i < lambdas_1.length; _i++) {
            var lambda = lambdas_1[_i];
            buildLambda(lambda);
        }
    }
}
else if (process.argv[2] === 'publish') {
    if (process.argv.length >= 4) {
        publishLambda(process.argv[3]);
    }
    else {
        var lambdas = discoverLambdaFunctions();
        for (var _a = 0, lambdas_2 = lambdas; _a < lambdas_2.length; _a++) {
            var lambda = lambdas_2[_a];
            publishLambda(lambda);
        }
    }
}
//# sourceMappingURL=cli.js.map