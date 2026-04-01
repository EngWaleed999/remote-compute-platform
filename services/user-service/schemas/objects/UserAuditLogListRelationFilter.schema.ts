import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogWhereInputObjectSchema as UserAuditLogWhereInputObjectSchema } from './UserAuditLogWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => UserAuditLogWhereInputObjectSchema).optional(),
  some: z.lazy(() => UserAuditLogWhereInputObjectSchema).optional(),
  none: z.lazy(() => UserAuditLogWhereInputObjectSchema).optional()
}).strict();
export const UserAuditLogListRelationFilterObjectSchema: z.ZodType<Prisma.UserAuditLogListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogListRelationFilter>;
export const UserAuditLogListRelationFilterObjectZodSchema = makeSchema();
