import { Queue, Job } from 'bull';
import { N8nService } from '../n8n.service';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowEventsGateway } from '../gateways/workflow-events.gateway';
interface WebhookPayload {
    workflowId: string;
    event: string;
    data: Record<string, any>;
}
export declare class WebhookQueueService {
    private webhookQueue;
    private readonly n8nService;
    private readonly prisma;
    private readonly eventsGateway;
    private readonly logger;
    constructor(webhookQueue: Queue, n8nService: N8nService, prisma: PrismaService, eventsGateway: WorkflowEventsGateway);
    addToQueue(payload: WebhookPayload): Promise<Job<any>>;
    processWebhook(job: Job<WebhookPayload>): Promise<{
        success: boolean;
    }>;
    getQueueStatus(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
    private handleExecutionError;
}
export {};
