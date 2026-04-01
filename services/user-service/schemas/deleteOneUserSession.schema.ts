import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './objects/UserSessionSelect.schema';
import { UserSessionIncludeObjectSchema as UserSessionIncludeObjectSchema } from './objects/UserSessionInclude.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './objects/UserSessionWhereUniqueInput.schema';

export const UserSessionDeleteOneSchema: z.ZodType<Prisma.UserSessionDeleteArgs> = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), where: UserSessionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserSessionDeleteArgs>;

export const UserSessionDeleteOneZodSchema = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), where: UserSessionWhereUniqueInputObjectSchema }).strict();