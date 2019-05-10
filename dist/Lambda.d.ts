export interface ILambdaCallback {
    (error?: string, response?: ILambdaResponse): void;
}
export declare enum EHttpMethod {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    PATCH = "PATCH"
}
export interface ILambdaResponse {
    statusCode: number;
    headers: {
        [key: string]: string;
    };
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
    httpMethod: EHttpMethod;
    extendedRequestId: string;
    apiId: string;
}
export interface ILambdaEvent {
    resource: string;
    path: string;
    httpMethod: EHttpMethod;
    headers: {
        [key: string]: string;
    };
    multiValueHeaders: {
        [key: string]: string[];
    };
    queryStringParameters: {
        [key: string]: string;
    };
    multiValueQueryStringParameters: {
        [key: string]: string;
    };
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
export declare class Lambda {
    protected readonly event: ILambdaEvent;
    protected readonly context: ILambdaContext;
    protected readonly callback: ILambdaCallback;
    constructor(event: ILambdaEvent, context: ILambdaContext, callback: ILambdaCallback);
    get(): void;
    put(): void;
    post(): void;
    delete(): void;
    options(): void;
    head(): void;
    patch(): void;
    test(): void;
    protected render(data: any, statusCode?: number, headers?: any): void;
    protected renderError(error: string): void;
}
