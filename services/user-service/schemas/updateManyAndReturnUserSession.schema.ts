import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './objects/UserSessionSelect.schema';
import { UserSessionUpdateManyMutationInputObjectSchema as UserSessionUpdateManyMutationInputObjectSchema } from './objects/UserSessionUpdateManyMutationInput.schema';
import { UserSessionWhereInputObjectSchema as UserSessionWhereInputObjectSchema } from './objects/UserSessionWhereInput.schema';

export const UserSessionUpdateManyAndReturnSchema: z.ZodType<Prisma.UserSessionUpdateManyAndReturnArgs> = z.object({ select: UserSessionSelectObjectSchema.optional(), data: UserSessionUpdateManyMutationInputObjectSchema, where: UserSessionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserSessionUpdateManyAndReturnArgs>;

export const UserSessionUpdateManyAndReturnZodSchema = z.object({ select: UserSessionSelectObjectSchema.optional(), data: UserSessionUpdateManyMutationInputObjectSchema, where: UserSessionWhereInputObjectSchema.optional() }).strict();