import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './objects/UserSessionSelect.schema';
import { UserSessionIncludeObjectSchema as UserSessionIncludeObjectSchema } from './objects/UserSessionInclude.schema';
import { UserSessionCreateInputObjectSchema as UserSessionCreateInputObjectSchema } from './objects/UserSessionCreateInput.schema';
import { UserSessionUncheckedCreateInputObjectSchema as UserSessionUncheckedCreateInputObjectSchema } from './objects/UserSessionUncheckedCreateInput.schema';

export const UserSessionCreateOneSchema: z.ZodType<Prisma.UserSessionCreateArgs> = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), data: z.union([UserSessionCreateInputObjectSchema, UserSessionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.UserSessionCreateArgs>;

export const UserSessionCreateOneZodSchema = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), data: z.union([UserSessionCreateInputObjectSchema, UserSessionUncheckedCreateInputObjectSchema]) }).strict();