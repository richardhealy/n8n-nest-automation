import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { N8nModule } from './modules/n8n/n8n.module';
import { WebhookModule } from './modules/webhooks/webhook.module';
import { HealthModule } from './modules/health/health.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { AuthModule } from './modules/auth/auth.module';

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
