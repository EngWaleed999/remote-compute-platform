import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './UserAuditLogWhereUniqueInput.schema';
import { UserAuditLogCreateWithoutUserInputObjectSchema as UserAuditLogCreateWithoutUserInputObjectSchema } from './UserAuditLogCreateWithoutUserInput.schema';
import { UserAuditLogUncheckedCreateWithoutUserInputObjectSchema as UserAuditLogUncheckedCreateWithoutUserInputObjectSchema } from './UserAuditLogUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserAuditLogCreateWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const UserAuditLogCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.UserAuditLogCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogCreateOrConnectWithoutUserInput>;
export const UserAuditLogCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
