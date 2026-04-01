import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogCreateManyUserInputObjectSchema as UserAuditLogCreateManyUserInputObjectSchema } from './UserAuditLogCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => UserAuditLogCreateManyUserInputObjectSchema), z.lazy(() => UserAuditLogCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const UserAuditLogCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.UserAuditLogCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogCreateManyUserInputEnvelope>;
export const UserAuditLogCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
