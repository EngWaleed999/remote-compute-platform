import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogSelectObjectSchema as UserAuditLogSelectObjectSchema } from './objects/UserAuditLogSelect.schema';
import { UserAuditLogCreateManyInputObjectSchema as UserAuditLogCreateManyInputObjectSchema } from './objects/UserAuditLogCreateManyInput.schema';

export const UserAuditLogCreateManyAndReturnSchema: z.ZodType<Prisma.UserAuditLogCreateManyAndReturnArgs> = z.object({ select: UserAuditLogSelectObjectSchema.optional(), data: z.union([ UserAuditLogCreateManyInputObjectSchema, z.array(UserAuditLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.UserAuditLogCreateManyAndReturnArgs>;

export const UserAuditLogCreateManyAndReturnZodSchema = z.object({ select: UserAuditLogSelectObjectSchema.optional(), data: z.union([ UserAuditLogCreateManyInputObjectSchema, z.array(UserAuditLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();