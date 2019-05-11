import * as fs from 'fs';
import * as shell from 'shelljs';
import * as archiver from 'archiver';
import { touchDirectories } from "./utils";

export function discoverLambdaFunctions(): string[] {
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

export function buildLambda(lambda: string): void {
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
