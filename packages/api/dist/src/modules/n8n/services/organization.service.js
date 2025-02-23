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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
let OrganizationService = class OrganizationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.organization.create({
            data: {
                apiKey: this.generateApiKey(),
                name: data.name,
                whiteLabel: data.whiteLabel ? JSON.stringify(data.whiteLabel) : client_1.Prisma.JsonNull,
                users: {
                    connect: { id: userId }
                }
            }
        });
    }
    async update(user, id, updateDto) {
        await this.validateAccess(user, id);
        return this.prisma.organization.update({
            where: { id },
            data: updateDto,
        });
    }
    async getOrganization(user, id) {
        await this.validateAccess(user, id);
        return this.prisma.organization.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                templates: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        tags: true,
                    },
                },
            },
        });
    }
    async regenerateApiKey(user, id) {
        await this.validateAccess(user, id);
        const apiKey = this.generateApiKey();
        return this.prisma.organization.update({
            where: { id },
            data: { apiKey },
            select: { apiKey: true },
        });
    }
    async getStats(user, id) {
        await this.validateAccess(user, id);
        const [userCount, templateCount, workflowCount, activeWorkflowCount] = await Promise.all([
            this.prisma.user.count({
                where: { organizationId: id },
            }),
            this.prisma.template.count({
                where: { organizationId: id },
            }),
            this.prisma.workflow.count({
                where: { user: { organizationId: id } },
            }),
            this.prisma.workflow.count({
                where: {
                    user: { organizationId: id },
                    active: true,
                },
            }),
        ]);
        return {
            users: userCount,
            templates: templateCount,
            workflows: workflowCount,
            activeWorkflows: activeWorkflowCount,
        };
    }
    async validateAccess(user, organizationId) {
        if (user.organizationId !== organizationId) {
            throw new common_1.UnauthorizedException('No access to this organization');
        }
        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        return organization;
    }
    generateApiKey() {
        return `n8n_${(0, crypto_1.randomBytes)(32).toString('hex')}`;
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map