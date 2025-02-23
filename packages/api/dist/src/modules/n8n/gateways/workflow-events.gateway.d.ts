import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
interface WorkflowMetrics {
    executionTime: number;
    memoryUsage: number;
    successRate: number;
    lastExecuted: Date;
}
interface WorkflowProgress {
    step: string;
    percentage: number;
    message: string;
    timestamp: Date;
}
export declare class WorkflowEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private userSockets;
    handleConnection(client: Socket & {
        user: User;
    }): Promise<void>;
    handleDisconnect(client: Socket & {
        user: User;
    }): void;
    handleSubscribeWorkflow(client: Socket & {
        user: User;
    }, workflowId: string): void;
    handleUnsubscribeWorkflow(client: Socket & {
        user: User;
    }, workflowId: string): void;
    handleSubscribeQueue(client: Socket & {
        user: User;
    }): void;
    handleWorkflowViewing(client: Socket & {
        user: User;
    }, workflowId: string): void;
    notifyWorkflowExecution(workflowId: string, data: any): void;
    notifyWorkflowStatus(workflowId: string, status: boolean): void;
    notifyUser(userId: string, event: string, data: any): void;
    notifyQueueUpdate(position: number, total: number, workflowId: string): void;
    notifyWorkflowMetrics(workflowId: string, metrics: WorkflowMetrics): void;
    notifyError(userId: string, error: {
        workflowId: string;
        message: string;
        severity: 'warning' | 'error' | 'critical';
    }): void;
    notifyProgress(workflowId: string, progress: WorkflowProgress): void;
    notifyCollaborationUpdate(workflowId: string, update: {
        userId: string;
        action: 'joined' | 'left' | 'viewing' | 'editing';
        metadata?: Record<string, any>;
    }): void;
}
export {};
