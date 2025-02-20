import { Module } from '@nestjs/common';
import { N8nController } from './n8n.controller';
import { N8nService } from './n8n.service';
import { TemplatePresetService } from './services/template-preset.service';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './controllers/organization.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UserManagementService } from './services/user-management.service';
import { UserManagementController } from './controllers/user-management.controller';
import { BullModule } from '@nestjs/bull';
import { WebhookQueueService } from './services/webhook-queue.service';
import { WebhookController } from './controllers/webhook.controller';
import { WorkflowEventsGateway } from './gateways/workflow-events.gateway';
import { WorkflowHistoryService } from './services/workflow-history.service';
import { WorkflowSchedulerService } from './services/workflow-scheduler.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'webhook-events',
    }),
  ],
  controllers: [
    N8nController,
    OrganizationController,
    UserManagementController,
    WebhookController,
  ],
  providers: [
    N8nService,
    TemplatePresetService,
    OrganizationService,
    UserManagementService,
    WebhookQueueService,
    WorkflowEventsGateway,
    WorkflowHistoryService,
    WorkflowSchedulerService,
  ],
  exports: [N8nService, WorkflowHistoryService],
})
export class N8nModule {} 