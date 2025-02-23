import { WebhookQueueService } from '../services/webhook-queue.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class WebhookController {
    private readonly webhookQueue;
    private readonly prisma;
    private readonly logger;
    constructor(webhookQueue: WebhookQueueService, prisma: PrismaService);
    handleWebhook(token: string, headers: Record<string, string>, payload: any): Promise<{
        success: boolean;
    }>;
    getQueueStatus(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
}
