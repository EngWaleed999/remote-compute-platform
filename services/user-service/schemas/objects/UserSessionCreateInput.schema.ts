import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateNestedOneWithoutSessionsInputObjectSchema as UserCreateNestedOneWithoutSessionsInputObjectSchema } from './UserCreateNestedOneWithoutSessionsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
  lastUsedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputObjectSchema)
}).strict();
export const UserSessionCreateInputObjectSchema: z.ZodType<Prisma.UserSessionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionCreateInput>;
export const UserSessionCreateInputObjectZodSchema = makeSchema();
