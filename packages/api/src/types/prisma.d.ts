import type { Prisma } from '@prisma/client'

declare global {
  namespace PrismaJson {
    type WhiteLabel = {
      logo?: string;
      colors?: Record<string, string>;
      [key: string]: any;
    }
  }
}

export type User = Prisma.UserGetPayload<Record<string, never>>
export type Organization = Prisma.OrganizationGetPayload<Record<string, never>>
export type Workflow = Prisma.WorkflowGetPayload<Record<string, never>> 