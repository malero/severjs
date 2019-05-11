#! /usr/bin/env node
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as shell from 'shelljs';
import * as aws from 'aws-sdk';

// Load credentials and set region from JSON file
aws.config.loadFromPath('./aws.json');

for (let j = 0; j < process.argv.length; j++) {  
    console.log(`${j}: ${process.argv[j]}`);
}

const lambdaRegex: RegExp = /([^\.]+)\.lambda\.ts$/;
const lambdas: string[] = [];

function touchDirectories(directories: string[]): void {
    for (const dir of directories) {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
}

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

for (const lambda of lambdas) {
    directories = [
        `./build/${lambda}/`,
        `./dist/${lambda}/`,
    ];
    touchDirectories(directories);

    console.log(`Creating lambda function ${lambda}.`);
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
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.glob(`*.js`, {
        cwd: `./dist/${lambda}/`
    });
    archive.finalize();
}
