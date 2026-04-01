import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogOrderByWithRelationInputObjectSchema as UserAuditLogOrderByWithRelationInputObjectSchema } from './objects/UserAuditLogOrderByWithRelationInput.schema';
import { UserAuditLogWhereInputObjectSchema as UserAuditLogWhereInputObjectSchema } from './objects/UserAuditLogWhereInput.schema';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './objects/UserAuditLogWhereUniqueInput.schema';
import { UserAuditLogCountAggregateInputObjectSchema as UserAuditLogCountAggregateInputObjectSchema } from './objects/UserAuditLogCountAggregateInput.schema';

export const UserAuditLogCountSchema: z.ZodType<Prisma.UserAuditLogCountArgs> = z.object({ orderBy: z.union([UserAuditLogOrderByWithRelationInputObjectSchema, UserAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserAuditLogWhereInputObjectSchema.optional(), cursor: UserAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UserAuditLogCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.UserAuditLogCountArgs>;

export const UserAuditLogCountZodSchema = z.object({ orderBy: z.union([UserAuditLogOrderByWithRelationInputObjectSchema, UserAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserAuditLogWhereInputObjectSchema.optional(), cursor: UserAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UserAuditLogCountAggregateInputObjectSchema ]).optional() }).strict();