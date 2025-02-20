import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookDto } from './dto/webhook.dto';
import { ConfigService } from '@nestjs/config';

@Controller('webhooks/n8n')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  async handleWebhook(
    @Headers('x-n8n-signature') signature: string,
    @Body() webhookDto: WebhookDto,
  ) {
    // Verify webhook signature
    if (!this.verifyWebhookSignature(signature, webhookDto)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return this.webhookService.handleWebhook(webhookDto);
  }

  private verifyWebhookSignature(signature: string, payload: any): boolean {
    // Implement signature verification logic
    const webhookSecret = this.config.get<string>('N8N_WEBHOOK_SECRET');
    // Add your signature verification logic here
    return true; // Replace with actual verification
  }
} 