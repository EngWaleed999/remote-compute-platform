import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionWhereInputObjectSchema as UserSessionWhereInputObjectSchema } from './objects/UserSessionWhereInput.schema';

export const UserSessionDeleteManySchema: z.ZodType<Prisma.UserSessionDeleteManyArgs> = z.object({ where: UserSessionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserSessionDeleteManyArgs>;

export const UserSessionDeleteManyZodSchema = z.object({ where: UserSessionWhereInputObjectSchema.optional() }).strict();