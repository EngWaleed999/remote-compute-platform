import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogSelectObjectSchema as UserAuditLogSelectObjectSchema } from './objects/UserAuditLogSelect.schema';
import { UserAuditLogIncludeObjectSchema as UserAuditLogIncludeObjectSchema } from './objects/UserAuditLogInclude.schema';
import { UserAuditLogCreateInputObjectSchema as UserAuditLogCreateInputObjectSchema } from './objects/UserAuditLogCreateInput.schema';
import { UserAuditLogUncheckedCreateInputObjectSchema as UserAuditLogUncheckedCreateInputObjectSchema } from './objects/UserAuditLogUncheckedCreateInput.schema';

export const UserAuditLogCreateOneSchema: z.ZodType<Prisma.UserAuditLogCreateArgs> = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), data: z.union([UserAuditLogCreateInputObjectSchema, UserAuditLogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.UserAuditLogCreateArgs>;

export const UserAuditLogCreateOneZodSchema = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), data: z.union([UserAuditLogCreateInputObjectSchema, UserAuditLogUncheckedCreateInputObjectSchema]) }).strict();