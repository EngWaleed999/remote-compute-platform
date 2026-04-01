import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistorySelectObjectSchema as LoginHistorySelectObjectSchema } from './objects/LoginHistorySelect.schema';
import { LoginHistoryCreateManyInputObjectSchema as LoginHistoryCreateManyInputObjectSchema } from './objects/LoginHistoryCreateManyInput.schema';

export const LoginHistoryCreateManyAndReturnSchema: z.ZodType<Prisma.LoginHistoryCreateManyAndReturnArgs> = z.object({ select: LoginHistorySelectObjectSchema.optional(), data: z.union([ LoginHistoryCreateManyInputObjectSchema, z.array(LoginHistoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.LoginHistoryCreateManyAndReturnArgs>;

export const LoginHistoryCreateManyAndReturnZodSchema = z.object({ select: LoginHistorySelectObjectSchema.optional(), data: z.union([ LoginHistoryCreateManyInputObjectSchema, z.array(LoginHistoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();