import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { N8nService } from '../n8n/n8n.service';
import axios from 'axios';

interface WebhookResult {
  success: boolean;
  data: unknown;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly n8nService: N8nService,
    private readonly config: ConfigService,
  ) {}

  async processWebhook(
    organizationId: string,
    workflowId: string,
    payload: Record<string, unknown>,
  ): Promise<WebhookResult> {
    try {
      this.logger.debug(
        `Processing webhook for organization ${organizationId}, workflow ${workflowId}`,
      );

      const webhookUrl = `${this.config.get<string>('N8N_API_URL')}/workflows/${workflowId}/webhook`;

      if (!webhookUrl) {
        throw new Error('N8N_API_URL is not configured');
      }

      const apiKey = this.config.get<string>('N8N_API_KEY');
      if (!apiKey) {
        throw new Error('N8N_API_KEY is not configured');
      }

      const response = await axios.post<unknown>(
        webhookUrl,
        {
          data: payload,
          organizationId,
        },
        {
          headers: {
            'X-N8N-API-KEY': apiKey,
          },
        },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(
        `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
