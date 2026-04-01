import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { LoginHistoryIncludeObjectSchema as LoginHistoryIncludeObjectSchema } from './objects/LoginHistoryInclude.schema';
import { LoginHistoryOrderByWithRelationInputObjectSchema as LoginHistoryOrderByWithRelationInputObjectSchema } from './objects/LoginHistoryOrderByWithRelationInput.schema';
import { LoginHistoryWhereInputObjectSchema as LoginHistoryWhereInputObjectSchema } from './objects/LoginHistoryWhereInput.schema';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './objects/LoginHistoryWhereUniqueInput.schema';
import { LoginHistoryScalarFieldEnumSchema } from './enums/LoginHistoryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const LoginHistoryFindFirstSelectSchema: z.ZodType<Prisma.LoginHistorySelect> = z.object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    user: z.boolean().optional(),
    success: z.boolean().optional(),
    method: z.boolean().optional(),
    ipAddress: z.boolean().optional(),
    userAgent: z.boolean().optional(),
    deviceType: z.boolean().optional(),
    location: z.boolean().optional(),
    failureReason: z.boolean().optional(),
    createdAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.LoginHistorySelect>;

export const LoginHistoryFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    userId: z.boolean().optional(),
    user: z.boolean().optional(),
    success: z.boolean().optional(),
    method: z.boolean().optional(),
    ipAddress: z.boolean().optional(),
    userAgent: z.boolean().optional(),
    deviceType: z.boolean().optional(),
    location: z.boolean().optional(),
    failureReason: z.boolean().optional(),
    createdAt: z.boolean().optional()
  }).strict();

export const LoginHistoryFindFirstSchema: z.ZodType<Prisma.LoginHistoryFindFirstArgs> = z.object({ select: LoginHistoryFindFirstSelectSchema.optional(), include: z.lazy(() => LoginHistoryIncludeObjectSchema.optional()), orderBy: z.union([LoginHistoryOrderByWithRelationInputObjectSchema, LoginHistoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginHistoryWhereInputObjectSchema.optional(), cursor: LoginHistoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LoginHistoryScalarFieldEnumSchema, LoginHistoryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.LoginHistoryFindFirstArgs>;

export const LoginHistoryFindFirstZodSchema = z.object({ select: LoginHistoryFindFirstSelectSchema.optional(), include: z.lazy(() => LoginHistoryIncludeObjectSchema.optional()), orderBy: z.union([LoginHistoryOrderByWithRelationInputObjectSchema, LoginHistoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginHistoryWhereInputObjectSchema.optional(), cursor: LoginHistoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LoginHistoryScalarFieldEnumSchema, LoginHistoryScalarFieldEnumSchema.array()]).optional() }).strict();