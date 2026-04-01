import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './objects/UserSessionSelect.schema';
import { UserSessionIncludeObjectSchema as UserSessionIncludeObjectSchema } from './objects/UserSessionInclude.schema';
import { UserSessionUpdateInputObjectSchema as UserSessionUpdateInputObjectSchema } from './objects/UserSessionUpdateInput.schema';
import { UserSessionUncheckedUpdateInputObjectSchema as UserSessionUncheckedUpdateInputObjectSchema } from './objects/UserSessionUncheckedUpdateInput.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './objects/UserSessionWhereUniqueInput.schema';

export const UserSessionUpdateOneSchema: z.ZodType<Prisma.UserSessionUpdateArgs> = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), data: z.union([UserSessionUpdateInputObjectSchema, UserSessionUncheckedUpdateInputObjectSchema]), where: UserSessionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserSessionUpdateArgs>;

export const UserSessionUpdateOneZodSchema = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), data: z.union([UserSessionUpdateInputObjectSchema, UserSessionUncheckedUpdateInputObjectSchema]), where: UserSessionWhereUniqueInputObjectSchema }).strict();