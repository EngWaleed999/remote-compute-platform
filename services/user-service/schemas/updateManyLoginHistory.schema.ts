import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistoryUpdateManyMutationInputObjectSchema as LoginHistoryUpdateManyMutationInputObjectSchema } from './objects/LoginHistoryUpdateManyMutationInput.schema';
import { LoginHistoryWhereInputObjectSchema as LoginHistoryWhereInputObjectSchema } from './objects/LoginHistoryWhereInput.schema';

export const LoginHistoryUpdateManySchema: z.ZodType<Prisma.LoginHistoryUpdateManyArgs> = z.object({ data: LoginHistoryUpdateManyMutationInputObjectSchema, where: LoginHistoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LoginHistoryUpdateManyArgs>;

export const LoginHistoryUpdateManyZodSchema = z.object({ data: LoginHistoryUpdateManyMutationInputObjectSchema, where: LoginHistoryWhereInputObjectSchema.optional() }).strict();