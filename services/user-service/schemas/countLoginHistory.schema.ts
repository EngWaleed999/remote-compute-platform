import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistoryOrderByWithRelationInputObjectSchema as LoginHistoryOrderByWithRelationInputObjectSchema } from './objects/LoginHistoryOrderByWithRelationInput.schema';
import { LoginHistoryWhereInputObjectSchema as LoginHistoryWhereInputObjectSchema } from './objects/LoginHistoryWhereInput.schema';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './objects/LoginHistoryWhereUniqueInput.schema';
import { LoginHistoryCountAggregateInputObjectSchema as LoginHistoryCountAggregateInputObjectSchema } from './objects/LoginHistoryCountAggregateInput.schema';

export const LoginHistoryCountSchema: z.ZodType<Prisma.LoginHistoryCountArgs> = z.object({ orderBy: z.union([LoginHistoryOrderByWithRelationInputObjectSchema, LoginHistoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginHistoryWhereInputObjectSchema.optional(), cursor: LoginHistoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), LoginHistoryCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.LoginHistoryCountArgs>;

export const LoginHistoryCountZodSchema = z.object({ orderBy: z.union([LoginHistoryOrderByWithRelationInputObjectSchema, LoginHistoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginHistoryWhereInputObjectSchema.optional(), cursor: LoginHistoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), LoginHistoryCountAggregateInputObjectSchema ]).optional() }).strict();