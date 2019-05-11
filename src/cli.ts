#! /usr/bin/env node
import * as rimraf from 'rimraf';
import * as aws from 'aws-sdk';
import * as fs from 'fs';
import * as shell from 'shelljs';
import * as archiver from 'archiver';

// Load credentials and set region from JSON file
aws.config.loadFromPath('./aws.json');

const serviceJSON = fs.readFileSync('./service.json');  
let serviceConfiguration: any = JSON.parse(serviceJSON.toString());  

console.log('Building service: ', serviceConfiguration.name);

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
    const functionName: string = `${serviceConfiguration.name}${lambda}`;
    console.log(`Publishing lambda function ${functionName}.`);

    var params = {
        FunctionName: functionName,
        Code: {
            ZipFile: fs.readFileSync(`./dist/${lambda}/${lambda}.zip`)
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

function buildLambda(lambda: string, callback?: any): void {
    const lambdaDist: string = `./dist/${lambda}/`;
    rimraf.sync(lambdaDist);
    touchDirectories([lambdaDist]);

    console.log(`Building lambda function ${lambda}.`);
    fs.writeFileSync(`./src/main.ts`, `
        import { ILambdaEvent, ILambdaContext, ILambdaCallback } from "severjs";
        import { ${lambda} } from "./${lambda}.lambda";

        export function dispatch(event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback): void {
        new ${lambda}(event, context, callback);
        }
    `);
    
    shell.exec(`tsc ./src/main.ts --outDir ./dist/${lambda}/`);

    var output = fs.createWriteStream(`./dist/${lambda}/${lambda}.zip`);
    output.on('close', () => {
        if (callback) callback();
    });

    var archive = archiver('zip', {
        zlib: { level: 0 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.glob(`**/*.js`, {
        cwd: `./dist/${lambda}/`
    });
    archive.finalize();
    fs.unlinkSync(`./src/main.ts`);
}

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
        buildLambda(process.argv[3], () => {
            publishLambda(process.argv[3]); 
        });
    } else {
        const lambdas: string[] = discoverLambdaFunctions();
        for (const lambda of lambdas) {
            buildLambda(lambda, () => {
                publishLambda(lambda);
            });
        }
    }
}
