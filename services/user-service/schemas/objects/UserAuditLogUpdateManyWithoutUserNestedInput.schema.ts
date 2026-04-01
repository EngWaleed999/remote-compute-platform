import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogCreateWithoutUserInputObjectSchema as UserAuditLogCreateWithoutUserInputObjectSchema } from './UserAuditLogCreateWithoutUserInput.schema';
import { UserAuditLogUncheckedCreateWithoutUserInputObjectSchema as UserAuditLogUncheckedCreateWithoutUserInputObjectSchema } from './UserAuditLogUncheckedCreateWithoutUserInput.schema';
import { UserAuditLogCreateOrConnectWithoutUserInputObjectSchema as UserAuditLogCreateOrConnectWithoutUserInputObjectSchema } from './UserAuditLogCreateOrConnectWithoutUserInput.schema';
import { UserAuditLogUpsertWithWhereUniqueWithoutUserInputObjectSchema as UserAuditLogUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './UserAuditLogUpsertWithWhereUniqueWithoutUserInput.schema';
import { UserAuditLogCreateManyUserInputEnvelopeObjectSchema as UserAuditLogCreateManyUserInputEnvelopeObjectSchema } from './UserAuditLogCreateManyUserInputEnvelope.schema';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './UserAuditLogWhereUniqueInput.schema';
import { UserAuditLogUpdateWithWhereUniqueWithoutUserInputObjectSchema as UserAuditLogUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './UserAuditLogUpdateWithWhereUniqueWithoutUserInput.schema';
import { UserAuditLogUpdateManyWithWhereWithoutUserInputObjectSchema as UserAuditLogUpdateManyWithWhereWithoutUserInputObjectSchema } from './UserAuditLogUpdateManyWithWhereWithoutUserInput.schema';
import { UserAuditLogScalarWhereInputObjectSchema as UserAuditLogScalarWhereInputObjectSchema } from './UserAuditLogScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserAuditLogCreateWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogCreateWithoutUserInputObjectSchema).array(), z.lazy(() => UserAuditLogUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UserAuditLogCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UserAuditLogUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UserAuditLogCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema), z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema), z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema), z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema), z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UserAuditLogUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UserAuditLogUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UserAuditLogScalarWhereInputObjectSchema), z.lazy(() => UserAuditLogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const UserAuditLogUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.UserAuditLogUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogUpdateManyWithoutUserNestedInput>;
export const UserAuditLogUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
