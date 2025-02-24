import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OrganizationController } from './controllers/organization.controller';
import { UserManagementController } from './controllers/user-management.controller';
import { WebhookController } from './controllers/webhook.controller';
import { WorkflowController } from './controllers/workflow.controller';
import { WorkflowEventsGateway } from './gateways/workflow-events.gateway';
import { N8nController } from './n8n.controller';
import { N8nService } from './n8n.service';
import { OrganizationService } from './services/organization.service';
import { TemplatePresetService } from './services/template-preset.service';
import { UserManagementService } from './services/user-management.service';
import { WebhookQueueService } from './services/webhook-queue.service';
import { WorkflowHistoryService } from './services/workflow-history.service';
import { WorkflowSchedulerService } from './services/workflow-scheduler.service';
import { WorkflowService } from './services/workflow.service';
import { WebhookModule } from './webhook.module';

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
    WebhookModule,
  ],
  controllers: [
    N8nController,
    OrganizationController,
    UserManagementController,
    WorkflowController,
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
    WorkflowService,
  ],
  exports: [N8nService, WorkflowHistoryService],
})
export class N8nModule {}
