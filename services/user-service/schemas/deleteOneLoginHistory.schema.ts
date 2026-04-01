import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistorySelectObjectSchema as LoginHistorySelectObjectSchema } from './objects/LoginHistorySelect.schema';
import { LoginHistoryIncludeObjectSchema as LoginHistoryIncludeObjectSchema } from './objects/LoginHistoryInclude.schema';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './objects/LoginHistoryWhereUniqueInput.schema';

export const LoginHistoryDeleteOneSchema: z.ZodType<Prisma.LoginHistoryDeleteArgs> = z.object({ select: LoginHistorySelectObjectSchema.optional(), include: LoginHistoryIncludeObjectSchema.optional(), where: LoginHistoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LoginHistoryDeleteArgs>;

export const LoginHistoryDeleteOneZodSchema = z.object({ select: LoginHistorySelectObjectSchema.optional(), include: LoginHistoryIncludeObjectSchema.optional(), where: LoginHistoryWhereUniqueInputObjectSchema }).strict();