import { ILambdaEvent, ILambdaContext, ILambdaCallback } from "./interfaces";
import { EHttpMethod } from "./constants";


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
