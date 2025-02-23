import { ConfigService } from '@nestjs/config';
import { N8nService } from '../n8n/n8n.service';
interface WebhookResult {
    success: boolean;
    data: unknown;
}
export declare class WebhookService {
    private readonly n8nService;
    private readonly config;
    private readonly logger;
    constructor(n8nService: N8nService, config: ConfigService);
    processWebhook(organizationId: string, workflowId: string, payload: Record<string, unknown>): Promise<WebhookResult>;
}
export {};
