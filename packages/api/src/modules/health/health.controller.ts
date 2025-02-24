import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      // Database health check
      async () => {
        await this.prisma.$queryRaw`SELECT 1`;
        return { database: { status: 'up' } };
      },

      // Redis health check
      () =>
        this.http.pingCheck(
          'redis',
          process.env.REDIS_HOST || 'redis://localhost:6379',
        ),

      // Disk storage check
      () =>
        this.disk.checkStorage('storage', {
          thresholdPercent: 0.9,
          path: '/',
        }),

      // Memory heap check
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
    ]);
  }
}
