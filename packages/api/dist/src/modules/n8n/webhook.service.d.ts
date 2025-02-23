import { PrismaService } from '../prisma/prisma.service';
import { WebhookDto } from './dto/webhook.dto';
export declare class WebhookService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleWebhook(webhookDto: WebhookDto): Promise<{
        status: string;
        message: string;
    }>;
    private handleWorkflowCompletion;
    private handleWorkflowError;
    private handleGenericWebhook;
}
