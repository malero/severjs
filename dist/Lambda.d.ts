import { ILambdaEvent, ILambdaContext, ILambdaCallback } from "./interfaces";
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
