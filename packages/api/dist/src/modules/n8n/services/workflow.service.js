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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const n8n_service_1 = require("../n8n.service");
let WorkflowService = class WorkflowService {
    constructor(prisma, n8nService) {
        this.prisma = prisma;
        this.n8nService = n8nService;
    }
    async create(user, createWorkflowDto) {
        console.log('Creating workflow:', {
            dto: createWorkflowDto,
            userId: user.id,
            organizationId: user.organizationId
        });
        const n8nWorkflow = await this.n8nService.createWorkflow(user, createWorkflowDto);
        return this.prisma.workflow.create({
            data: {
                name: createWorkflowDto.name,
                description: createWorkflowDto.description,
                config: {
                    nodes: createWorkflowDto.nodes,
                    connections: createWorkflowDto.connections,
                    n8nWorkflowId: n8nWorkflow.id,
                },
                userId: user.id,
                active: createWorkflowDto.active || false,
            },
        });
    }
    async findAll(user) {
        return this.prisma.workflow.findMany({
            where: {
                userId: user.id,
            },
        });
    }
    async activate(user, id) {
        await this.validateAccess(user, id);
        return this.prisma.workflow.update({
            where: { id },
            data: { active: true },
        });
    }
    async deactivate(user, id) {
        await this.validateAccess(user, id);
        return this.prisma.workflow.update({
            where: { id },
            data: { active: false },
        });
    }
    async remove(user, id) {
        await this.validateAccess(user, id);
        return this.prisma.workflow.delete({
            where: { id },
        });
    }
    async validateAccess(user, workflowId) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id: workflowId },
        });
        if (!workflow) {
            throw new common_1.NotFoundException('Workflow not found');
        }
        if (workflow.userId !== user.id) {
            throw new common_1.UnauthorizedException('No access to this workflow');
        }
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        n8n_service_1.N8nService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map