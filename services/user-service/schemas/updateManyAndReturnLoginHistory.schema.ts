import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistorySelectObjectSchema as LoginHistorySelectObjectSchema } from './objects/LoginHistorySelect.schema';
import { LoginHistoryUpdateManyMutationInputObjectSchema as LoginHistoryUpdateManyMutationInputObjectSchema } from './objects/LoginHistoryUpdateManyMutationInput.schema';
import { LoginHistoryWhereInputObjectSchema as LoginHistoryWhereInputObjectSchema } from './objects/LoginHistoryWhereInput.schema';

export const LoginHistoryUpdateManyAndReturnSchema: z.ZodType<Prisma.LoginHistoryUpdateManyAndReturnArgs> = z.object({ select: LoginHistorySelectObjectSchema.optional(), data: LoginHistoryUpdateManyMutationInputObjectSchema, where: LoginHistoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LoginHistoryUpdateManyAndReturnArgs>;

export const LoginHistoryUpdateManyAndReturnZodSchema = z.object({ select: LoginHistorySelectObjectSchema.optional(), data: LoginHistoryUpdateManyMutationInputObjectSchema, where: LoginHistoryWhereInputObjectSchema.optional() }).strict();