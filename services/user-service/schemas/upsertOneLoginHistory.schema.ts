import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistorySelectObjectSchema as LoginHistorySelectObjectSchema } from './objects/LoginHistorySelect.schema';
import { LoginHistoryIncludeObjectSchema as LoginHistoryIncludeObjectSchema } from './objects/LoginHistoryInclude.schema';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './objects/LoginHistoryWhereUniqueInput.schema';
import { LoginHistoryCreateInputObjectSchema as LoginHistoryCreateInputObjectSchema } from './objects/LoginHistoryCreateInput.schema';
import { LoginHistoryUncheckedCreateInputObjectSchema as LoginHistoryUncheckedCreateInputObjectSchema } from './objects/LoginHistoryUncheckedCreateInput.schema';
import { LoginHistoryUpdateInputObjectSchema as LoginHistoryUpdateInputObjectSchema } from './objects/LoginHistoryUpdateInput.schema';
import { LoginHistoryUncheckedUpdateInputObjectSchema as LoginHistoryUncheckedUpdateInputObjectSchema } from './objects/LoginHistoryUncheckedUpdateInput.schema';

export const LoginHistoryUpsertOneSchema: z.ZodType<Prisma.LoginHistoryUpsertArgs> = z.object({ select: LoginHistorySelectObjectSchema.optional(), include: LoginHistoryIncludeObjectSchema.optional(), where: LoginHistoryWhereUniqueInputObjectSchema, create: z.union([ LoginHistoryCreateInputObjectSchema, LoginHistoryUncheckedCreateInputObjectSchema ]), update: z.union([ LoginHistoryUpdateInputObjectSchema, LoginHistoryUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.LoginHistoryUpsertArgs>;

export const LoginHistoryUpsertOneZodSchema = z.object({ select: LoginHistorySelectObjectSchema.optional(), include: LoginHistoryIncludeObjectSchema.optional(), where: LoginHistoryWhereUniqueInputObjectSchema, create: z.union([ LoginHistoryCreateInputObjectSchema, LoginHistoryUncheckedCreateInputObjectSchema ]), update: z.union([ LoginHistoryUpdateInputObjectSchema, LoginHistoryUncheckedUpdateInputObjectSchema ]) }).strict();