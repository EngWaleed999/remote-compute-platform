import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistoryCreateManyInputObjectSchema as LoginHistoryCreateManyInputObjectSchema } from './objects/LoginHistoryCreateManyInput.schema';

export const LoginHistoryCreateManySchema: z.ZodType<Prisma.LoginHistoryCreateManyArgs> = z.object({ data: z.union([ LoginHistoryCreateManyInputObjectSchema, z.array(LoginHistoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.LoginHistoryCreateManyArgs>;

export const LoginHistoryCreateManyZodSchema = z.object({ data: z.union([ LoginHistoryCreateManyInputObjectSchema, z.array(LoginHistoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();