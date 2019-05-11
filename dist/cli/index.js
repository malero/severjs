#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws = require("aws-sdk");
var build_1 = require("./build");
var publish_1 = require("./publish");
// Load credentials and set region from JSON file
aws.config.loadFromPath('./aws.json');
for (var j = 0; j < process.argv.length; j++) {
    console.log(j + ": " + process.argv[j]);
}
if (process.argv.length == 2) {
}
else if (process.argv[2] === 'build') {
    if (process.argv.length >= 4) {
        build_1.buildLambda(process.argv[3]);
    }
    else {
        var lambdas = build_1.discoverLambdaFunctions();
        for (var _i = 0, lambdas_1 = lambdas; _i < lambdas_1.length; _i++) {
            var lambda = lambdas_1[_i];
            build_1.buildLambda(lambda);
        }
    }
}
else if (process.argv[2] === 'publish') {
    if (process.argv.length >= 4) {
        publish_1.publishLambda(process.argv[3]);
    }
    else {
        var lambdas = build_1.discoverLambdaFunctions();
        for (var _a = 0, lambdas_2 = lambdas; _a < lambdas_2.length; _a++) {
            var lambda = lambdas_2[_a];
            publish_1.publishLambda(lambda);
        }
    }
}
//# sourceMappingURL=index.js.map