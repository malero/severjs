#! /usr/bin/env node
import * as aws from 'aws-sdk';
import * as fs from 'fs';
import * as shell from 'shelljs';
import * as archiver from 'archiver';

function touchDirectories(directories: string[]): void {
    for (const dir of directories) {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
}

function publishLambda(lambda: string): void {
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

function discoverLambdaFunctions(): string[] {
    const lambdaRegex: RegExp = /([^\.]+)\.lambda\.ts$/;
    const lambdas: string[] = [];
    
    let directories: string[] = [
        `./build/`,
        `./dist/`,
    ];
    touchDirectories(directories);
    
    const items = fs.readdirSync('./src');
        
    for (var i=0; i<items.length; i++) {
        const match: RegExpExecArray | null = lambdaRegex.exec(items[i]);
        if (match)
            lambdas.push(match[1]);
    }

    return lambdas;
}

function buildLambda(lambda: string): void {
    const directories: string[] = [
        `./build/${lambda}/`,
        `./dist/${lambda}/`,
    ];
    touchDirectories(directories);

    console.log(`Building lambda function ${lambda}.`);
    fs.writeFileSync(`./build/${lambda}/main.ts`, `
        import { ILambdaEvent, ILambdaContext, ILambdaCallback } from "severjs";
        import { ${lambda} } from "./${lambda}.lambda";

        export function dispatch(event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback): void {
        new ${lambda}(event, context, callback);
        }
    `);
    
    fs.copyFileSync(`./src/${lambda}.lambda.ts`, `./build/${lambda}/${lambda}.lambda.ts`);
    shell.exec(`tsc ./build/${lambda}/main.ts --outDir ./dist/${lambda}/`);

    var output = fs.createWriteStream(`./dist/${lambda}/${lambda}.zip`);
    var archive = archiver('zip', {
        zlib: { level: 5 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.glob(`*.js`, {
        cwd: `./dist/${lambda}/`,
        root: ''
    });
    archive.finalize();
}

// Load credentials and set region from JSON file
aws.config.loadFromPath('./aws.json');

if (process.argv.length == 2) {

} else if (process.argv[2] === 'build') {
    if (process.argv.length >= 4) {
        buildLambda(process.argv[3]);
    } else {
        const lambdas: string[] = discoverLambdaFunctions();
        for (const lambda of lambdas) {
            buildLambda(lambda);
        }
    }
} else if (process.argv[2] === 'publish') {
    if (process.argv.length >= 4) {
        publishLambda(process.argv[3]);
    } else {
        const lambdas: string[] = discoverLambdaFunctions();
        for (const lambda of lambdas) {
            publishLambda(lambda);
        }
    }
}
