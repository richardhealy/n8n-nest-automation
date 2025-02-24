import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { N8nModule } from '../n8n/n8n.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [N8nModule, ConfigModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
