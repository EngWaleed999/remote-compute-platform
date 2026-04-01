import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistorySelectObjectSchema as LoginHistorySelectObjectSchema } from './objects/LoginHistorySelect.schema';
import { LoginHistoryIncludeObjectSchema as LoginHistoryIncludeObjectSchema } from './objects/LoginHistoryInclude.schema';
import { LoginHistoryUpdateInputObjectSchema as LoginHistoryUpdateInputObjectSchema } from './objects/LoginHistoryUpdateInput.schema';
import { LoginHistoryUncheckedUpdateInputObjectSchema as LoginHistoryUncheckedUpdateInputObjectSchema } from './objects/LoginHistoryUncheckedUpdateInput.schema';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './objects/LoginHistoryWhereUniqueInput.schema';

export const LoginHistoryUpdateOneSchema: z.ZodType<Prisma.LoginHistoryUpdateArgs> = z.object({ select: LoginHistorySelectObjectSchema.optional(), include: LoginHistoryIncludeObjectSchema.optional(), data: z.union([LoginHistoryUpdateInputObjectSchema, LoginHistoryUncheckedUpdateInputObjectSchema]), where: LoginHistoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LoginHistoryUpdateArgs>;

export const LoginHistoryUpdateOneZodSchema = z.object({ select: LoginHistorySelectObjectSchema.optional(), include: LoginHistoryIncludeObjectSchema.optional(), data: z.union([LoginHistoryUpdateInputObjectSchema, LoginHistoryUncheckedUpdateInputObjectSchema]), where: LoginHistoryWhereUniqueInputObjectSchema }).strict();