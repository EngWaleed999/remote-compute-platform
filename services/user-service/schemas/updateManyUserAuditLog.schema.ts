import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogUpdateManyMutationInputObjectSchema as UserAuditLogUpdateManyMutationInputObjectSchema } from './objects/UserAuditLogUpdateManyMutationInput.schema';
import { UserAuditLogWhereInputObjectSchema as UserAuditLogWhereInputObjectSchema } from './objects/UserAuditLogWhereInput.schema';

export const UserAuditLogUpdateManySchema: z.ZodType<Prisma.UserAuditLogUpdateManyArgs> = z.object({ data: UserAuditLogUpdateManyMutationInputObjectSchema, where: UserAuditLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserAuditLogUpdateManyArgs>;

export const UserAuditLogUpdateManyZodSchema = z.object({ data: UserAuditLogUpdateManyMutationInputObjectSchema, where: UserAuditLogWhereInputObjectSchema.optional() }).strict();