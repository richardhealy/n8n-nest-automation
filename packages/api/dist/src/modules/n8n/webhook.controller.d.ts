import { WebhookService } from './webhook.service';
import { WebhookDto } from './dto/webhook.dto';
import { ConfigService } from '@nestjs/config';
export declare class WebhookController {
    private readonly webhookService;
    private readonly config;
    constructor(webhookService: WebhookService, config: ConfigService);
    handleWebhook(signature: string, webhookDto: WebhookDto): Promise<{
        status: string;
        message: string;
    }>;
    private verifyWebhookSignature;
}
