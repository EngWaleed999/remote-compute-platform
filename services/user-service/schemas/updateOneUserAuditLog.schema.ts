import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogSelectObjectSchema as UserAuditLogSelectObjectSchema } from './objects/UserAuditLogSelect.schema';
import { UserAuditLogIncludeObjectSchema as UserAuditLogIncludeObjectSchema } from './objects/UserAuditLogInclude.schema';
import { UserAuditLogUpdateInputObjectSchema as UserAuditLogUpdateInputObjectSchema } from './objects/UserAuditLogUpdateInput.schema';
import { UserAuditLogUncheckedUpdateInputObjectSchema as UserAuditLogUncheckedUpdateInputObjectSchema } from './objects/UserAuditLogUncheckedUpdateInput.schema';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './objects/UserAuditLogWhereUniqueInput.schema';

export const UserAuditLogUpdateOneSchema: z.ZodType<Prisma.UserAuditLogUpdateArgs> = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), data: z.union([UserAuditLogUpdateInputObjectSchema, UserAuditLogUncheckedUpdateInputObjectSchema]), where: UserAuditLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserAuditLogUpdateArgs>;

export const UserAuditLogUpdateOneZodSchema = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), data: z.union([UserAuditLogUpdateInputObjectSchema, UserAuditLogUncheckedUpdateInputObjectSchema]), where: UserAuditLogWhereUniqueInputObjectSchema }).strict();