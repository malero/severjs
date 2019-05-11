#! /usr/bin/env node
import * as aws from 'aws-sdk';
import { buildLambda, discoverLambdaFunctions } from './build';
import { publishLambda } from './publish';

// Load credentials and set region from JSON file
aws.config.loadFromPath('./aws.json');

for (let j = 0; j < process.argv.length; j++) {  
    console.log(`${j}: ${process.argv[j]}`);
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
        publishLambda(process.argv[3]);
    } else {
        const lambdas: string[] = discoverLambdaFunctions();
        for (const lambda of lambdas) {
            publishLambda(lambda);
        }
    }
}
