import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  success: z.boolean().optional(),
  method: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  deviceType: z.boolean().optional(),
  location: z.boolean().optional(),
  failureReason: z.boolean().optional(),
  createdAt: z.boolean().optional()
}).strict();
export const LoginHistorySelectObjectSchema: z.ZodType<Prisma.LoginHistorySelect> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistorySelect>;
export const LoginHistorySelectObjectZodSchema = makeSchema();
