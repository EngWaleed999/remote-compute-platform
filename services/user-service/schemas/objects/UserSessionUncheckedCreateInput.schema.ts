import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  userId: z.string(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  revokedAt: z.coerce.date().optional().nullable(),
  revokedReason: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  lastUsedAt: z.coerce.date().optional()
}).strict();
export const UserSessionUncheckedCreateInputObjectSchema: z.ZodType<Prisma.UserSessionUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionUncheckedCreateInput>;
export const UserSessionUncheckedCreateInputObjectZodSchema = makeSchema();
