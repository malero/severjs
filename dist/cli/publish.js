"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws = require("aws-sdk");
var fs = require("fs");
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
exports.publishLambda = publishLambda;
//# sourceMappingURL=publish.js.map