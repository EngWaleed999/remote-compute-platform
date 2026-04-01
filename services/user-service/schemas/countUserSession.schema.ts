import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionOrderByWithRelationInputObjectSchema as UserSessionOrderByWithRelationInputObjectSchema } from './objects/UserSessionOrderByWithRelationInput.schema';
import { UserSessionWhereInputObjectSchema as UserSessionWhereInputObjectSchema } from './objects/UserSessionWhereInput.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './objects/UserSessionWhereUniqueInput.schema';
import { UserSessionCountAggregateInputObjectSchema as UserSessionCountAggregateInputObjectSchema } from './objects/UserSessionCountAggregateInput.schema';

export const UserSessionCountSchema: z.ZodType<Prisma.UserSessionCountArgs> = z.object({ orderBy: z.union([UserSessionOrderByWithRelationInputObjectSchema, UserSessionOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserSessionWhereInputObjectSchema.optional(), cursor: UserSessionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UserSessionCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.UserSessionCountArgs>;

export const UserSessionCountZodSchema = z.object({ orderBy: z.union([UserSessionOrderByWithRelationInputObjectSchema, UserSessionOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserSessionWhereInputObjectSchema.optional(), cursor: UserSessionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UserSessionCountAggregateInputObjectSchema ]).optional() }).strict();