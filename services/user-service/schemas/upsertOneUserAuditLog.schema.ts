import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogSelectObjectSchema as UserAuditLogSelectObjectSchema } from './objects/UserAuditLogSelect.schema';
import { UserAuditLogIncludeObjectSchema as UserAuditLogIncludeObjectSchema } from './objects/UserAuditLogInclude.schema';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './objects/UserAuditLogWhereUniqueInput.schema';
import { UserAuditLogCreateInputObjectSchema as UserAuditLogCreateInputObjectSchema } from './objects/UserAuditLogCreateInput.schema';
import { UserAuditLogUncheckedCreateInputObjectSchema as UserAuditLogUncheckedCreateInputObjectSchema } from './objects/UserAuditLogUncheckedCreateInput.schema';
import { UserAuditLogUpdateInputObjectSchema as UserAuditLogUpdateInputObjectSchema } from './objects/UserAuditLogUpdateInput.schema';
import { UserAuditLogUncheckedUpdateInputObjectSchema as UserAuditLogUncheckedUpdateInputObjectSchema } from './objects/UserAuditLogUncheckedUpdateInput.schema';

export const UserAuditLogUpsertOneSchema: z.ZodType<Prisma.UserAuditLogUpsertArgs> = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), where: UserAuditLogWhereUniqueInputObjectSchema, create: z.union([ UserAuditLogCreateInputObjectSchema, UserAuditLogUncheckedCreateInputObjectSchema ]), update: z.union([ UserAuditLogUpdateInputObjectSchema, UserAuditLogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.UserAuditLogUpsertArgs>;

export const UserAuditLogUpsertOneZodSchema = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), where: UserAuditLogWhereUniqueInputObjectSchema, create: z.union([ UserAuditLogCreateInputObjectSchema, UserAuditLogUncheckedCreateInputObjectSchema ]), update: z.union([ UserAuditLogUpdateInputObjectSchema, UserAuditLogUncheckedUpdateInputObjectSchema ]) }).strict();