import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogCreateWithoutUserInputObjectSchema as UserAuditLogCreateWithoutUserInputObjectSchema } from './UserAuditLogCreateWithoutUserInput.schema';
import { UserAuditLogUncheckedCreateWithoutUserInputObjectSchema as UserAuditLogUncheckedCreateWithoutUserInputObjectSchema } from './UserAuditLogUncheckedCreateWithoutUserInput.schema';
import { UserAuditLogCreateOrConnectWithoutUserInputObjectSchema as UserAuditLogCreateOrConnectWithoutUserInputObjectSchema } from './UserAuditLogCreateOrConnectWithoutUserInput.schema';
import { UserAuditLogCreateManyUserInputEnvelopeObjectSchema as UserAuditLogCreateManyUserInputEnvelopeObjectSchema } from './UserAuditLogCreateManyUserInputEnvelope.schema';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './UserAuditLogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserAuditLogCreateWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogCreateWithoutUserInputObjectSchema).array(), z.lazy(() => UserAuditLogUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UserAuditLogCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UserAuditLogCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema), z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const UserAuditLogUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.UserAuditLogUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogUncheckedCreateNestedManyWithoutUserInput>;
export const UserAuditLogUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
