export declare enum WebhookMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export declare class CreateWebhookDto {
    name: string;
    description?: string;
    method: WebhookMethod;
    path: string;
    headers?: Record<string, string>;
    workflowId: string;
}
