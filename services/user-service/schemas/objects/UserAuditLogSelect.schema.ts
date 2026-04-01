import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  action: z.boolean().optional(),
  description: z.boolean().optional(),
  oldValues: z.boolean().optional(),
  newValues: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  requestId: z.boolean().optional(),
  createdAt: z.boolean().optional()
}).strict();
export const UserAuditLogSelectObjectSchema: z.ZodType<Prisma.UserAuditLogSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogSelect>;
export const UserAuditLogSelectObjectZodSchema = makeSchema();
