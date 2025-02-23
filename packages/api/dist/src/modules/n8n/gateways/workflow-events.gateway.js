"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WorkflowEventsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ws_jwt_guard_1 = require("../../auth/guards/ws-jwt.guard");
let WorkflowEventsGateway = WorkflowEventsGateway_1 = class WorkflowEventsGateway {
    constructor() {
        this.server = new socket_io_1.Server();
        this.logger = new common_1.Logger(WorkflowEventsGateway_1.name);
        this.userSockets = new Map();
    }
    async handleConnection(client) {
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
    handleDisconnect(client) {
        const userId = client.user.id;
        this.userSockets.get(userId)?.delete(client.id);
        if (this.userSockets.get(userId)?.size === 0) {
            this.userSockets.delete(userId);
        }
        this.logger.debug(`Client disconnected: ${client.id} (User: ${userId})`);
    }
    handleSubscribeWorkflow(client, workflowId) {
        client.join(`workflow:${workflowId}`);
        this.logger.debug(`Client ${client.id} subscribed to workflow ${workflowId}`);
    }
    handleUnsubscribeWorkflow(client, workflowId) {
        client.leave(`workflow:${workflowId}`);
        this.logger.debug(`Client ${client.id} unsubscribed from workflow ${workflowId}`);
    }
    handleSubscribeQueue(client) {
        client.join('queue-updates');
        this.logger.debug(`Client ${client.id} subscribed to queue updates`);
    }
    handleWorkflowViewing(client, workflowId) {
        const userData = {
            id: client.user.id,
            email: client.user.email,
            timestamp: new Date(),
        };
        this.server.to(`workflow:${workflowId}`).emit('user-viewing', userData);
        this.logger.debug(`User ${client.user.email} is viewing workflow ${workflowId}`);
    }
    notifyWorkflowExecution(workflowId, data) {
        this.server.to(`workflow:${workflowId}`).emit('execution-update', data);
    }
    notifyWorkflowStatus(workflowId, status) {
        this.server.to(`workflow:${workflowId}`).emit('status-update', { active: status });
    }
    notifyUser(userId, event, data) {
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
            userSockets.forEach(socketId => {
                this.server.to(socketId).emit(event, data);
            });
        }
    }
    notifyQueueUpdate(position, total, workflowId) {
        this.server.to(`workflow:${workflowId}`).emit('queue-position', {
            position,
            total,
            workflowId,
            timestamp: new Date(),
        });
    }
    notifyWorkflowMetrics(workflowId, metrics) {
        this.server.to(`workflow:${workflowId}`).emit('metrics-update', {
            ...metrics,
            timestamp: new Date(),
        });
    }
    notifyError(userId, error) {
        this.notifyUser(userId, 'workflow-error', {
            ...error,
            timestamp: new Date(),
        });
    }
    notifyProgress(workflowId, progress) {
        this.server.to(`workflow:${workflowId}`).emit('progress-update', {
            ...progress,
            timestamp: new Date(),
        });
    }
    notifyCollaborationUpdate(workflowId, update) {
        this.server.to(`workflow:${workflowId}`).emit('collaboration-update', {
            ...update,
            timestamp: new Date(),
        });
    }
};
exports.WorkflowEventsGateway = WorkflowEventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WorkflowEventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe-workflow'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkflowEventsGateway.prototype, "handleSubscribeWorkflow", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe-workflow'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkflowEventsGateway.prototype, "handleUnsubscribeWorkflow", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe-queue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkflowEventsGateway.prototype, "handleSubscribeQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('workflow-viewing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WorkflowEventsGateway.prototype, "handleWorkflowViewing", null);
exports.WorkflowEventsGateway = WorkflowEventsGateway = WorkflowEventsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'workflows',
        cors: true,
    }),
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard)
], WorkflowEventsGateway);
//# sourceMappingURL=workflow-events.gateway.js.map