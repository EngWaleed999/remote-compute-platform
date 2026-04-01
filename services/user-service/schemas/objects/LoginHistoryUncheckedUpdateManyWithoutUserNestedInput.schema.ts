import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryCreateWithoutUserInputObjectSchema as LoginHistoryCreateWithoutUserInputObjectSchema } from './LoginHistoryCreateWithoutUserInput.schema';
import { LoginHistoryUncheckedCreateWithoutUserInputObjectSchema as LoginHistoryUncheckedCreateWithoutUserInputObjectSchema } from './LoginHistoryUncheckedCreateWithoutUserInput.schema';
import { LoginHistoryCreateOrConnectWithoutUserInputObjectSchema as LoginHistoryCreateOrConnectWithoutUserInputObjectSchema } from './LoginHistoryCreateOrConnectWithoutUserInput.schema';
import { LoginHistoryUpsertWithWhereUniqueWithoutUserInputObjectSchema as LoginHistoryUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './LoginHistoryUpsertWithWhereUniqueWithoutUserInput.schema';
import { LoginHistoryCreateManyUserInputEnvelopeObjectSchema as LoginHistoryCreateManyUserInputEnvelopeObjectSchema } from './LoginHistoryCreateManyUserInputEnvelope.schema';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './LoginHistoryWhereUniqueInput.schema';
import { LoginHistoryUpdateWithWhereUniqueWithoutUserInputObjectSchema as LoginHistoryUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './LoginHistoryUpdateWithWhereUniqueWithoutUserInput.schema';
import { LoginHistoryUpdateManyWithWhereWithoutUserInputObjectSchema as LoginHistoryUpdateManyWithWhereWithoutUserInputObjectSchema } from './LoginHistoryUpdateManyWithWhereWithoutUserInput.schema';
import { LoginHistoryScalarWhereInputObjectSchema as LoginHistoryScalarWhereInputObjectSchema } from './LoginHistoryScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => LoginHistoryCreateWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryCreateWithoutUserInputObjectSchema).array(), z.lazy(() => LoginHistoryUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => LoginHistoryCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => LoginHistoryUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => LoginHistoryCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema), z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema), z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema), z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema), z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => LoginHistoryUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => LoginHistoryUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => LoginHistoryScalarWhereInputObjectSchema), z.lazy(() => LoginHistoryScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const LoginHistoryUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.LoginHistoryUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryUncheckedUpdateManyWithoutUserNestedInput>;
export const LoginHistoryUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
