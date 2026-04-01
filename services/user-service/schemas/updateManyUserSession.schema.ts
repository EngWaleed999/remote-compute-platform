import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionUpdateManyMutationInputObjectSchema as UserSessionUpdateManyMutationInputObjectSchema } from './objects/UserSessionUpdateManyMutationInput.schema';
import { UserSessionWhereInputObjectSchema as UserSessionWhereInputObjectSchema } from './objects/UserSessionWhereInput.schema';

export const UserSessionUpdateManySchema: z.ZodType<Prisma.UserSessionUpdateManyArgs> = z.object({ data: UserSessionUpdateManyMutationInputObjectSchema, where: UserSessionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserSessionUpdateManyArgs>;

export const UserSessionUpdateManyZodSchema = z.object({ data: UserSessionUpdateManyMutationInputObjectSchema, where: UserSessionWhereInputObjectSchema.optional() }).strict();