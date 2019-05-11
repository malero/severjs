#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rimraf = require("rimraf");
var aws = require("aws-sdk");
var fs = require("fs");
var shell = require("shelljs");
var archiver = require("archiver");
// Load credentials and set region from JSON file
aws.config.loadFromPath('./aws.json');
var serviceJSON = fs.readFileSync('./service.json');
var serviceConfiguration = JSON.parse(serviceJSON.toString());
console.log('Building service: ', serviceConfiguration.name);
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
    var functionName = "" + serviceConfiguration.name + lambda;
    console.log("Publishing lambda function " + functionName + ".");
    var params = {
        FunctionName: functionName,
        Code: {
            ZipFile: fs.readFileSync("./dist/" + lambda + "/" + lambda + ".zip")
        },
        Handler: "main.dispatch",
        Role: process.env.LAMBDA_ROLE,
        Runtime: "nodejs8.10",
        MemorySize: 128,
        Publish: true
    };
    /*awsLambda.deleteFunction({FunctionName: functionName}, (data) => {
        console.log(data);
    });
    */
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
function buildLambda(lambda, callback) {
    var lambdaDist = "./dist/" + lambda + "/";
    rimraf.sync(lambdaDist);
    touchDirectories([lambdaDist]);
    console.log("Building lambda function " + lambda + ".");
    fs.writeFileSync("./src/main.ts", "\n        import { ILambdaEvent, ILambdaContext, ILambdaCallback } from \"severjs\";\n        import { " + lambda + " } from \"./" + lambda + ".lambda\";\n\n        export function dispatch(event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback): void {\n        new " + lambda + "(event, context, callback);\n        }\n    ");
    shell.exec("tsc ./src/main.ts --outDir ./dist/" + lambda + "/");
    var output = fs.createWriteStream("./dist/" + lambda + "/" + lambda + ".zip");
    output.on('close', function () {
        if (callback)
            callback();
    });
    var archive = archiver('zip', {
        zlib: { level: 0 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.glob("**/*.js", {
        cwd: "./dist/" + lambda + "/"
    });
    archive.finalize();
    fs.unlinkSync("./src/main.ts");
}
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
        buildLambda(process.argv[3], function () {
            publishLambda(process.argv[3]);
        });
    }
    else {
        var lambdas = discoverLambdaFunctions();
        var _loop_1 = function (lambda) {
            buildLambda(lambda, function () {
                publishLambda(lambda);
            });
        };
        for (var _a = 0, lambdas_2 = lambdas; _a < lambdas_2.length; _a++) {
            var lambda = lambdas_2[_a];
            _loop_1(lambda);
        }
    }
}
//# sourceMappingURL=cli.js.map