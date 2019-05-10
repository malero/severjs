import { EHttpMethod } from "./constants";

export interface ILambdaResponse {
    statusCode: number;
    headers: { [key: string]: string; }; 
    body: string;
    isBase64Encoded: boolean;
}

export interface ILambdaRequestIdentity {
    cognitoIdentityPoolId: string;
    cognitoIdentityId: string;
    apiKey: string;
    principalOrgId: string;
    cognitoAuthenticationType: string;
    userArn: string;
    apiKeyId: string;
    userAgent: string;
    accountId: string;
    caller: string;
    sourceIp: string;
    accessKey: string;
    cognitoAuthenticationProvider: string;
    user: number;
  }

export interface ILambdaRequestContext {
    path: string;
    accountId: number;
    resourceId: string;
    stage: string;
    domainPrefix: string;
    requestId: string;
    identity: ILambdaRequestIdentity;
    domainName: string;
    resourcePath: string;
    httpMethod: EHttpMethod,
    extendedRequestId: string;
    apiId: string;
};

export interface ILambdaEvent {
    resource: string;
    path: string;
    httpMethod: EHttpMethod;
    headers: { [key: string]: string; };
    multiValueHeaders: { [key: string]: string[]; },
    queryStringParameters: { [key: string]: string; };
    multiValueQueryStringParameters: { [key: string]: string; };
    pathParameters: any;
    stageVariables: any;
    requestContext: ILambdaRequestContext;
    body: string;
    isBase64Encoded: boolean;
  }

export interface ILambdaContext {
    callbackWaitsForEmptyEventLoop: boolean;
    logGroupName: string;
    logStreamName: string;
    functionName: string;
    memoryLimitInMB: string;
    functionVersion: string;
    invokeid: string;
    awsRequestId: string;
    invokedFunctionArn: string;
}

export interface ILambdaCallback {
    (error?: string, response?: ILambdaResponse): void;
}
