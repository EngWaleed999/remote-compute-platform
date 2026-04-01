import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogSelectObjectSchema as UserAuditLogSelectObjectSchema } from './objects/UserAuditLogSelect.schema';
import { UserAuditLogUpdateManyMutationInputObjectSchema as UserAuditLogUpdateManyMutationInputObjectSchema } from './objects/UserAuditLogUpdateManyMutationInput.schema';
import { UserAuditLogWhereInputObjectSchema as UserAuditLogWhereInputObjectSchema } from './objects/UserAuditLogWhereInput.schema';

export const UserAuditLogUpdateManyAndReturnSchema: z.ZodType<Prisma.UserAuditLogUpdateManyAndReturnArgs> = z.object({ select: UserAuditLogSelectObjectSchema.optional(), data: UserAuditLogUpdateManyMutationInputObjectSchema, where: UserAuditLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserAuditLogUpdateManyAndReturnArgs>;

export const UserAuditLogUpdateManyAndReturnZodSchema = z.object({ select: UserAuditLogSelectObjectSchema.optional(), data: UserAuditLogUpdateManyMutationInputObjectSchema, where: UserAuditLogWhereInputObjectSchema.optional() }).strict();