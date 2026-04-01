import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './objects/UserSessionSelect.schema';
import { UserSessionIncludeObjectSchema as UserSessionIncludeObjectSchema } from './objects/UserSessionInclude.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './objects/UserSessionWhereUniqueInput.schema';
import { UserSessionCreateInputObjectSchema as UserSessionCreateInputObjectSchema } from './objects/UserSessionCreateInput.schema';
import { UserSessionUncheckedCreateInputObjectSchema as UserSessionUncheckedCreateInputObjectSchema } from './objects/UserSessionUncheckedCreateInput.schema';
import { UserSessionUpdateInputObjectSchema as UserSessionUpdateInputObjectSchema } from './objects/UserSessionUpdateInput.schema';
import { UserSessionUncheckedUpdateInputObjectSchema as UserSessionUncheckedUpdateInputObjectSchema } from './objects/UserSessionUncheckedUpdateInput.schema';

export const UserSessionUpsertOneSchema: z.ZodType<Prisma.UserSessionUpsertArgs> = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), where: UserSessionWhereUniqueInputObjectSchema, create: z.union([ UserSessionCreateInputObjectSchema, UserSessionUncheckedCreateInputObjectSchema ]), update: z.union([ UserSessionUpdateInputObjectSchema, UserSessionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.UserSessionUpsertArgs>;

export const UserSessionUpsertOneZodSchema = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), where: UserSessionWhereUniqueInputObjectSchema, create: z.union([ UserSessionCreateInputObjectSchema, UserSessionUncheckedCreateInputObjectSchema ]), update: z.union([ UserSessionUpdateInputObjectSchema, UserSessionUncheckedUpdateInputObjectSchema ]) }).strict();