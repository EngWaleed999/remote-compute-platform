import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogIncludeObjectSchema as UserAuditLogIncludeObjectSchema } from './objects/UserAuditLogInclude.schema';
import { UserAuditLogOrderByWithRelationInputObjectSchema as UserAuditLogOrderByWithRelationInputObjectSchema } from './objects/UserAuditLogOrderByWithRelationInput.schema';
import { UserAuditLogWhereInputObjectSchema as UserAuditLogWhereInputObjectSchema } from './objects/UserAuditLogWhereInput.schema';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './objects/UserAuditLogWhereUniqueInput.schema';
import { UserAuditLogScalarFieldEnumSchema } from './enums/UserAuditLogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UserAuditLogFindFirstSelectSchema: z.ZodType<Prisma.UserAuditLogSelect> = z.object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    user: z.boolean().optional(),
    action: z.boolean().optional(),
    description: z.boolean().optional(),
    oldValues: z.boolean().optional(),
    newValues: z.boolean().optional(),
    ipAddress: z.boolean().optional(),
    userAgent: z.boolean().optional(),
    requestId: z.boolean().optional(),
    createdAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.UserAuditLogSelect>;

export const UserAuditLogFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    user: z.boolean().optional(),
    action: z.boolean().optional(),
    description: z.boolean().optional(),
    oldValues: z.boolean().optional(),
    newValues: z.boolean().optional(),
    ipAddress: z.boolean().optional(),
    userAgent: z.boolean().optional(),
    requestId: z.boolean().optional(),
    createdAt: z.boolean().optional()
  }).strict();

export const UserAuditLogFindFirstSchema: z.ZodType<Prisma.UserAuditLogFindFirstArgs> = z.object({ select: UserAuditLogFindFirstSelectSchema.optional(), include: z.lazy(() => UserAuditLogIncludeObjectSchema.optional()), orderBy: z.union([UserAuditLogOrderByWithRelationInputObjectSchema, UserAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserAuditLogWhereInputObjectSchema.optional(), cursor: UserAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UserAuditLogScalarFieldEnumSchema, UserAuditLogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.UserAuditLogFindFirstArgs>;

export const UserAuditLogFindFirstZodSchema = z.object({ select: UserAuditLogFindFirstSelectSchema.optional(), include: z.lazy(() => UserAuditLogIncludeObjectSchema.optional()), orderBy: z.union([UserAuditLogOrderByWithRelationInputObjectSchema, UserAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserAuditLogWhereInputObjectSchema.optional(), cursor: UserAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UserAuditLogScalarFieldEnumSchema, UserAuditLogScalarFieldEnumSchema.array()]).optional() }).strict();