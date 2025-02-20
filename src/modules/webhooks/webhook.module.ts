import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { N8nModule } from '../n8n/n8n.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [N8nModule, ConfigModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {} 