import * as aws from 'aws-sdk';
import * as fs from 'fs';

export function publishLambda(lambda: string): void {
    var awsLambda = new aws.Lambda({
        apiVersion: '2015-03-31',
        region: 'us-west-2'
    });

    var params = {
        FunctionName: lambda,
        Code: {
            ZipFile: fs.readFileSync(`./dist/${lambda}/${lambda}.zip`)
        },
        Handler: "main.dispatch",
        Role: process.env.LAMBDA_ROLE,
        Runtime: "nodejs8.10",
        MemorySize: 128,
        Publish: true
    };
    awsLambda.deleteFunction({FunctionName: lambda}, (data) => {
        console.log(data);
    });
    awsLambda.createFunction(params as any, function(err: any, data: any) {
        if (err) {
            console.log(err);
        } else {
            console.log('function created');
        }
    });
}
