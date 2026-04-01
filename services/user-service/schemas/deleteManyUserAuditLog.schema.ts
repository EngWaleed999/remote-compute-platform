import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogWhereInputObjectSchema as UserAuditLogWhereInputObjectSchema } from './objects/UserAuditLogWhereInput.schema';

export const UserAuditLogDeleteManySchema: z.ZodType<Prisma.UserAuditLogDeleteManyArgs> = z.object({ where: UserAuditLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserAuditLogDeleteManyArgs>;

export const UserAuditLogDeleteManyZodSchema = z.object({ where: UserAuditLogWhereInputObjectSchema.optional() }).strict();