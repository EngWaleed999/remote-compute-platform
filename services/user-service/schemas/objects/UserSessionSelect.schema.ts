import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  token: z.boolean().optional(),
  refreshToken: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  deviceType: z.boolean().optional(),
  location: z.boolean().optional(),
  isValid: z.boolean().optional(),
  revokedAt: z.boolean().optional(),
  revokedReason: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  lastUsedAt: z.boolean().optional()
}).strict();
export const UserSessionSelectObjectSchema: z.ZodType<Prisma.UserSessionSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionSelect>;
export const UserSessionSelectObjectZodSchema = makeSchema();
