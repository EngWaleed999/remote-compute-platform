import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistorySelectObjectSchema as LoginHistorySelectObjectSchema } from './objects/LoginHistorySelect.schema';
import { LoginHistoryIncludeObjectSchema as LoginHistoryIncludeObjectSchema } from './objects/LoginHistoryInclude.schema';
import { LoginHistoryCreateInputObjectSchema as LoginHistoryCreateInputObjectSchema } from './objects/LoginHistoryCreateInput.schema';
import { LoginHistoryUncheckedCreateInputObjectSchema as LoginHistoryUncheckedCreateInputObjectSchema } from './objects/LoginHistoryUncheckedCreateInput.schema';

export const LoginHistoryCreateOneSchema: z.ZodType<Prisma.LoginHistoryCreateArgs> = z.object({ select: LoginHistorySelectObjectSchema.optional(), include: LoginHistoryIncludeObjectSchema.optional(), data: z.union([LoginHistoryCreateInputObjectSchema, LoginHistoryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.LoginHistoryCreateArgs>;

export const LoginHistoryCreateOneZodSchema = z.object({ select: LoginHistorySelectObjectSchema.optional(), include: LoginHistoryIncludeObjectSchema.optional(), data: z.union([LoginHistoryCreateInputObjectSchema, LoginHistoryUncheckedCreateInputObjectSchema]) }).strict();