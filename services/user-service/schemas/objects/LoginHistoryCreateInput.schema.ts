import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateNestedOneWithoutLoginHistoryInputObjectSchema as UserCreateNestedOneWithoutLoginHistoryInputObjectSchema } from './UserCreateNestedOneWithoutLoginHistoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  success: z.boolean(),
  method: z.string(),
  ipAddress: z.string(),
  userAgent: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  failureReason: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutLoginHistoryInputObjectSchema)
}).strict();
export const LoginHistoryCreateInputObjectSchema: z.ZodType<Prisma.LoginHistoryCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryCreateInput>;
export const LoginHistoryCreateInputObjectZodSchema = makeSchema();
