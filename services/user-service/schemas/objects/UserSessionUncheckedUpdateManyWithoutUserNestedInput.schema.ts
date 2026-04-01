import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionCreateWithoutUserInputObjectSchema as UserSessionCreateWithoutUserInputObjectSchema } from './UserSessionCreateWithoutUserInput.schema';
import { UserSessionUncheckedCreateWithoutUserInputObjectSchema as UserSessionUncheckedCreateWithoutUserInputObjectSchema } from './UserSessionUncheckedCreateWithoutUserInput.schema';
import { UserSessionCreateOrConnectWithoutUserInputObjectSchema as UserSessionCreateOrConnectWithoutUserInputObjectSchema } from './UserSessionCreateOrConnectWithoutUserInput.schema';
import { UserSessionUpsertWithWhereUniqueWithoutUserInputObjectSchema as UserSessionUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './UserSessionUpsertWithWhereUniqueWithoutUserInput.schema';
import { UserSessionCreateManyUserInputEnvelopeObjectSchema as UserSessionCreateManyUserInputEnvelopeObjectSchema } from './UserSessionCreateManyUserInputEnvelope.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './UserSessionWhereUniqueInput.schema';
import { UserSessionUpdateWithWhereUniqueWithoutUserInputObjectSchema as UserSessionUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './UserSessionUpdateWithWhereUniqueWithoutUserInput.schema';
import { UserSessionUpdateManyWithWhereWithoutUserInputObjectSchema as UserSessionUpdateManyWithWhereWithoutUserInputObjectSchema } from './UserSessionUpdateManyWithWhereWithoutUserInput.schema';
import { UserSessionScalarWhereInputObjectSchema as UserSessionScalarWhereInputObjectSchema } from './UserSessionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserSessionCreateWithoutUserInputObjectSchema), z.lazy(() => UserSessionCreateWithoutUserInputObjectSchema).array(), z.lazy(() => UserSessionUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => UserSessionUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UserSessionCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => UserSessionCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UserSessionUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => UserSessionUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UserSessionCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => UserSessionWhereUniqueInputObjectSchema), z.lazy(() => UserSessionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UserSessionWhereUniqueInputObjectSchema), z.lazy(() => UserSessionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UserSessionWhereUniqueInputObjectSchema), z.lazy(() => UserSessionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UserSessionWhereUniqueInputObjectSchema), z.lazy(() => UserSessionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UserSessionUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => UserSessionUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UserSessionUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => UserSessionUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UserSessionScalarWhereInputObjectSchema), z.lazy(() => UserSessionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const UserSessionUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.UserSessionUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionUncheckedUpdateManyWithoutUserNestedInput>;
export const UserSessionUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
