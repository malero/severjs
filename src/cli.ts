#! /usr/bin/env node
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as shell from 'shelljs';

for (let j = 0; j < process.argv.length; j++) {  
    console.log(`${j}: ${process.argv[j]}`);
}

const lambdaRegex: RegExp = /([^\.]+)\.lambda\.ts$/;
const lambdas: string[] = [];

const dir: string = `./build/`;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const items = fs.readdirSync('./src');
    
for (var i=0; i<items.length; i++) {
    const match: RegExpExecArray | null = lambdaRegex.exec(items[i]);
    if (match)
        console.log('Match?', items[i], match[1]);
    if (match)
        lambdas.push(match[1]);
}

for (const lambda of lambdas) {
    const dir: string = `./build/${lambda}/`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    console.log(`Creating lambda function ${lambda}.`);
    fs.writeFileSync(`./build/${lambda}/main.ts`, `
        import { ILambdaEvent, ILambdaContext, ILambdaCallback } from "severjs";
        import { ${lambda} } from "./${lambda}.lambda";

        export function dispatch(event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback): void {
        new ${lambda}(event, context, callback);
        }
    `);
       
    fs.copyFileSync(`./src/${lambda}.lambda.ts`, `./build/${lambda}/${lambda}.lambda.ts`);
    shell.exec(`tsc ./build/${lambda}/main.ts --outFile ./build/${lambda}/main.js`);
}
