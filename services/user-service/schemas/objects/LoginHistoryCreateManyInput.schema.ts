import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  userId: z.string(),
  success: z.boolean(),
  method: z.string(),
  ipAddress: z.string(),
  userAgent: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  failureReason: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const LoginHistoryCreateManyInputObjectSchema: z.ZodType<Prisma.LoginHistoryCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryCreateManyInput>;
export const LoginHistoryCreateManyInputObjectZodSchema = makeSchema();
