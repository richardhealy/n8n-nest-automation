import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        userId: string;
        role: string;
        email: string;
    }): Promise<{
        role: import("@prisma/client").$Enums.UserRole;
        organization: {
            id: string;
            name: string;
            apiKey: string;
            whiteLabel: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            updatedAt: Date;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        organizationId: string;
    }>;
}
export {};
