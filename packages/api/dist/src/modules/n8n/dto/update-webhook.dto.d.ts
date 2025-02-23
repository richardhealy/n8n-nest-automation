import { WebhookMethod } from './create-webhook.dto';
export declare class UpdateWebhookDto {
    name?: string;
    description?: string;
    method?: WebhookMethod;
    path?: string;
    headers?: Record<string, string>;
}
