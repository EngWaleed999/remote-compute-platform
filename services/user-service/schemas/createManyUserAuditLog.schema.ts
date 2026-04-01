import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogCreateManyInputObjectSchema as UserAuditLogCreateManyInputObjectSchema } from './objects/UserAuditLogCreateManyInput.schema';

export const UserAuditLogCreateManySchema: z.ZodType<Prisma.UserAuditLogCreateManyArgs> = z.object({ data: z.union([ UserAuditLogCreateManyInputObjectSchema, z.array(UserAuditLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.UserAuditLogCreateManyArgs>;

export const UserAuditLogCreateManyZodSchema = z.object({ data: z.union([ UserAuditLogCreateManyInputObjectSchema, z.array(UserAuditLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();