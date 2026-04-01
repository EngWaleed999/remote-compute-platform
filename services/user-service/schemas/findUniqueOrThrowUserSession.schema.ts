import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './objects/UserSessionSelect.schema';
import { UserSessionIncludeObjectSchema as UserSessionIncludeObjectSchema } from './objects/UserSessionInclude.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './objects/UserSessionWhereUniqueInput.schema';

export const UserSessionFindUniqueOrThrowSchema: z.ZodType<Prisma.UserSessionFindUniqueOrThrowArgs> = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), where: UserSessionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserSessionFindUniqueOrThrowArgs>;

export const UserSessionFindUniqueOrThrowZodSchema = z.object({ select: UserSessionSelectObjectSchema.optional(), include: UserSessionIncludeObjectSchema.optional(), where: UserSessionWhereUniqueInputObjectSchema }).strict();