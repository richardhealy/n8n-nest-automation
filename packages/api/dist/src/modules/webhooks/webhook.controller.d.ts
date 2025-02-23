import { WebhookService } from './webhook.service';
interface WebhookResponse {
    success: boolean;
    data?: unknown;
    error?: string;
    message?: string;
}
export declare class WebhookController {
    private readonly webhookService;
    private readonly logger;
    constructor(webhookService: WebhookService);
    handleWebhook(organizationId: string, workflowId: string, payload: Record<string, unknown>): Promise<WebhookResponse>;
}
export {};
