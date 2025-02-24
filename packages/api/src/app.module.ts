import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { N8nModule } from './modules/n8n/n8n.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { WebhookModule } from './modules/webhooks/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      ignoreEnvFile: true,
    }),
    AuthModule,
    PrismaModule,
    N8nModule,
    WebhookModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
