import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserAuditLogSelectObjectSchema as UserAuditLogSelectObjectSchema } from './objects/UserAuditLogSelect.schema';
import { UserAuditLogIncludeObjectSchema as UserAuditLogIncludeObjectSchema } from './objects/UserAuditLogInclude.schema';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './objects/UserAuditLogWhereUniqueInput.schema';

export const UserAuditLogFindUniqueOrThrowSchema: z.ZodType<Prisma.UserAuditLogFindUniqueOrThrowArgs> = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), where: UserAuditLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserAuditLogFindUniqueOrThrowArgs>;

export const UserAuditLogFindUniqueOrThrowZodSchema = z.object({ select: UserAuditLogSelectObjectSchema.optional(), include: UserAuditLogIncludeObjectSchema.optional(), where: UserAuditLogWhereUniqueInputObjectSchema }).strict();