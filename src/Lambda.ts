export interface ILambdaCallback {
    (error?: string, response?: ILambdaResponse): void;
}

export enum EHttpMethod {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
    PATCH = 'PATCH',
}

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

export class Lambda {
    constructor(
        protected readonly event: ILambdaEvent,
        protected readonly context: ILambdaContext,
        protected readonly callback: ILambdaCallback) {
        switch (event.httpMethod) {
            case EHttpMethod.GET:
                this.get();
                break;
            case EHttpMethod.POST:
                this.post();
                break;
            case EHttpMethod.PUT:
                this.put();
                break;
            case EHttpMethod.DELETE:
                this.delete();
                break;
            case EHttpMethod.HEAD:
                this.head();
                break;
            case EHttpMethod.PATCH:
                this.patch();
                break;
            default:
                this.test();
                break;
        }
    }

    public get(): void { 
        this.renderError('Not Implemented.');
    }

    public put(): void { 
        this.renderError('Not Implemented.');
    }
    public post(): void { 
        this.renderError('Not Implemented.');
    }

    public delete(): void { 
        this.renderError('Not Implemented.');
    }

    public options(): void { 
        this.renderError('Not Implemented.');
    }

    public head(): void { 
        this.renderError('Not Implemented.');
    }

    public patch(): void { 
        this.renderError('Not Implemented.');
    }

    public test(): void { 
        this.renderError('Not Implemented.');
    }

    protected render(data: any, statusCode: number = 200, headers: any = {}) {
        this.callback(undefined, {
            statusCode: statusCode,
            headers: headers,
            body: JSON.stringify(data),
            isBase64Encoded: false
        });
    }

    protected renderError(error: string) {
        this.callback(error);
    }
}
