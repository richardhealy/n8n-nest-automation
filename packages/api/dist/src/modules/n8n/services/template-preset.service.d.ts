import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class TemplatePresetService {
    private readonly prisma;
    private readonly presets;
    constructor(prisma: PrismaService);
    createFromPreset(user: User, presetName: keyof typeof this.presets, name: string, description: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string;
        tags: string[];
        config: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
    }>;
    getAvailablePresets(): string[];
}
