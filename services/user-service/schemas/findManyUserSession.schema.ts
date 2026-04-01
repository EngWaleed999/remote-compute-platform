import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionIncludeObjectSchema as UserSessionIncludeObjectSchema } from './objects/UserSessionInclude.schema';
import { UserSessionOrderByWithRelationInputObjectSchema as UserSessionOrderByWithRelationInputObjectSchema } from './objects/UserSessionOrderByWithRelationInput.schema';
import { UserSessionWhereInputObjectSchema as UserSessionWhereInputObjectSchema } from './objects/UserSessionWhereInput.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './objects/UserSessionWhereUniqueInput.schema';
import { UserSessionScalarFieldEnumSchema } from './enums/UserSessionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UserSessionFindManySelectSchema: z.ZodType<Prisma.UserSessionSelect> = z.object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    user: z.boolean().optional(),
    token: z.boolean().optional(),
    refreshToken: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    ipAddress: z.boolean().optional(),
    userAgent: z.boolean().optional(),
    deviceType: z.boolean().optional(),
    location: z.boolean().optional(),
    isValid: z.boolean().optional(),
    revokedAt: z.boolean().optional(),
    revokedReason: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    lastUsedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.UserSessionSelect>;

export const UserSessionFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    user: z.boolean().optional(),
    token: z.boolean().optional(),
    refreshToken: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    ipAddress: z.boolean().optional(),
    userAgent: z.boolean().optional(),
    deviceType: z.boolean().optional(),
    location: z.boolean().optional(),
    isValid: z.boolean().optional(),
    revokedAt: z.boolean().optional(),
    revokedReason: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    lastUsedAt: z.boolean().optional()
  }).strict();

export const UserSessionFindManySchema: z.ZodType<Prisma.UserSessionFindManyArgs> = z.object({ select: UserSessionFindManySelectSchema.optional(), include: z.lazy(() => UserSessionIncludeObjectSchema.optional()), orderBy: z.union([UserSessionOrderByWithRelationInputObjectSchema, UserSessionOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserSessionWhereInputObjectSchema.optional(), cursor: UserSessionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UserSessionScalarFieldEnumSchema, UserSessionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.UserSessionFindManyArgs>;

export const UserSessionFindManyZodSchema = z.object({ select: UserSessionFindManySelectSchema.optional(), include: z.lazy(() => UserSessionIncludeObjectSchema.optional()), orderBy: z.union([UserSessionOrderByWithRelationInputObjectSchema, UserSessionOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserSessionWhereInputObjectSchema.optional(), cursor: UserSessionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UserSessionScalarFieldEnumSchema, UserSessionScalarFieldEnumSchema.array()]).optional() }).strict();