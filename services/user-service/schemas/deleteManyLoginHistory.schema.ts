import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistoryWhereInputObjectSchema as LoginHistoryWhereInputObjectSchema } from './objects/LoginHistoryWhereInput.schema';

export const LoginHistoryDeleteManySchema: z.ZodType<Prisma.LoginHistoryDeleteManyArgs> = z.object({ where: LoginHistoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LoginHistoryDeleteManyArgs>;

export const LoginHistoryDeleteManyZodSchema = z.object({ where: LoginHistoryWhereInputObjectSchema.optional() }).strict();