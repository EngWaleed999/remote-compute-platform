import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  success: z.boolean(),
  method: z.string(),
  ipAddress: z.string(),
  userAgent: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  failureReason: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const LoginHistoryCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.LoginHistoryCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryCreateWithoutUserInput>;
export const LoginHistoryCreateWithoutUserInputObjectZodSchema = makeSchema();
