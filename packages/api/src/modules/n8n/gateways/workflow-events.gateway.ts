import { Logger, UseGuards } from '@nestjs/common';
import {
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import type { User } from '@prisma/client';
import { Server, type Socket } from 'socket.io';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';

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

@WebSocketGateway({
	namespace: 'workflows',
	cors: true,
})
@UseGuards(WsJwtGuard)
export class WorkflowEventsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server = new Server();

	private readonly logger = new Logger(WorkflowEventsGateway.name);
	private userSockets: Map<string, Set<string>> = new Map();

	async handleConnection(client: Socket & { user: User }) {
		const userId = client.user.id;
		if (!this.userSockets.has(userId)) {
			this.userSockets.set(userId, new Set());
		}

		if (!this.userSockets.get(userId)) {
			this.userSockets.set(userId, new Set());
		}

		this.userSockets.get(userId)?.add(client.id);

		this.logger.debug(`Client connected: ${client.id} (User: ${userId})`);
	}

	handleDisconnect(client: Socket & { user: User }) {
		const userId = client.user.id;
		this.userSockets.get(userId)?.delete(client.id);
		if (this.userSockets.get(userId)?.size === 0) {
			this.userSockets.delete(userId);
		}

		this.logger.debug(`Client disconnected: ${client.id} (User: ${userId})`);
	}

	@SubscribeMessage('subscribe-workflow')
	handleSubscribeWorkflow(client: Socket & { user: User }, workflowId: string) {
		client.join(`workflow:${workflowId}`);
		this.logger.debug(
			`Client ${client.id} subscribed to workflow ${workflowId}`,
		);
	}

	@SubscribeMessage('unsubscribe-workflow')
	handleUnsubscribeWorkflow(
		client: Socket & { user: User },
		workflowId: string,
	) {
		client.leave(`workflow:${workflowId}`);
		this.logger.debug(
			`Client ${client.id} unsubscribed from workflow ${workflowId}`,
		);
	}

	@SubscribeMessage('subscribe-queue')
	handleSubscribeQueue(client: Socket & { user: User }) {
		client.join('queue-updates');
		this.logger.debug(`Client ${client.id} subscribed to queue updates`);
	}

	@SubscribeMessage('workflow-viewing')
	handleWorkflowViewing(client: Socket & { user: User }, workflowId: string) {
		const userData = {
			id: client.user.id,
			email: client.user.email,
			timestamp: new Date(),
		};

		this.server.to(`workflow:${workflowId}`).emit('user-viewing', userData);
		this.logger.debug(
			`User ${client.user.email} is viewing workflow ${workflowId}`,
		);
	}

	notifyWorkflowExecution(workflowId: string, data: Record<string, unknown>) {
		this.server.to(`workflow:${workflowId}`).emit('execution-update', data);
	}

	notifyWorkflowStatus(workflowId: string, status: boolean) {
		this.server
			.to(`workflow:${workflowId}`)
			.emit('status-update', { active: status });
	}

	notifyUser(userId: string, event: string, data: Record<string, unknown>) {
		const userSockets = this.userSockets.get(userId);
		if (userSockets) {
			for (const socketId of userSockets) {
				this.server.to(socketId).emit(event, data);
			}
		}
	}

	notifyQueueUpdate(position: number, total: number, workflowId: string) {
		this.server.to(`workflow:${workflowId}`).emit('queue-position', {
			position,
			total,
			workflowId,
			timestamp: new Date(),
		});
	}

	notifyWorkflowMetrics(workflowId: string, metrics: WorkflowMetrics) {
		this.server.to(`workflow:${workflowId}`).emit('metrics-update', {
			...metrics,
			timestamp: new Date(),
		});
	}

	notifyError(
		userId: string,
		error: {
			workflowId: string;
			message: string;
			severity: 'warning' | 'error' | 'critical';
		},
	) {
		this.notifyUser(userId, 'workflow-error', {
			...error,
			timestamp: new Date(),
		});
	}

	notifyProgress(workflowId: string, progress: WorkflowProgress) {
		this.server.to(`workflow:${workflowId}`).emit('progress-update', {
			...progress,
			timestamp: new Date(),
		});
	}

	notifyCollaborationUpdate(
		workflowId: string,
		update: {
			userId: string;
			action: 'joined' | 'left' | 'viewing' | 'editing';
			metadata?: Record<string, unknown>;
		},
	) {
		this.server.to(`workflow:${workflowId}`).emit('collaboration-update', {
			...update,
			timestamp: new Date(),
		});
	}
}
