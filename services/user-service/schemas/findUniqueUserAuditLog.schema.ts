import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogSelectObjectSchema as UserAuditLogSelectObjectSchema } from './objects/UserAuditLogSelect.schema';
import { UserAuditLogIncludeObjectSchema as UserAuditLogIncludeObjectSchema } from './objects/UserAuditLogInclude.schema';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './objects/UserAuditLogWhereUniqueInput.schema';

export const UserAuditLogFindUniqueSchema: z.ZodType<Prisma.UserAuditLogFindUniqueArgs> = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), where: UserAuditLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserAuditLogFindUniqueArgs>;

export const UserAuditLogFindUniqueZodSchema = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), where: UserAuditLogWhereUniqueInputObjectSchema }).strict();