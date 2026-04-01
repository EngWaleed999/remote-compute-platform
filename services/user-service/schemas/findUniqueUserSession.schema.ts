import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './objects/UserSessionSelect.schema';
import { UserSessionIncludeObjectSchema as UserSessionIncludeObjectSchema } from './objects/UserSessionInclude.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './objects/UserSessionWhereUniqueInput.schema';

export const UserSessionFindUniqueSchema: z.ZodType<Prisma.UserSessionFindUniqueArgs> = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), where: UserSessionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserSessionFindUniqueArgs>;

export const UserSessionFindUniqueZodSchema = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), where: UserSessionWhereUniqueInputObjectSchema }).strict();