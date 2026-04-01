import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryCreateWithoutUserInputObjectSchema as LoginHistoryCreateWithoutUserInputObjectSchema } from './LoginHistoryCreateWithoutUserInput.schema';
import { LoginHistoryUncheckedCreateWithoutUserInputObjectSchema as LoginHistoryUncheckedCreateWithoutUserInputObjectSchema } from './LoginHistoryUncheckedCreateWithoutUserInput.schema';
import { LoginHistoryCreateOrConnectWithoutUserInputObjectSchema as LoginHistoryCreateOrConnectWithoutUserInputObjectSchema } from './LoginHistoryCreateOrConnectWithoutUserInput.schema';
import { LoginHistoryCreateManyUserInputEnvelopeObjectSchema as LoginHistoryCreateManyUserInputEnvelopeObjectSchema } from './LoginHistoryCreateManyUserInputEnvelope.schema';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './LoginHistoryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => LoginHistoryCreateWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryCreateWithoutUserInputObjectSchema).array(), z.lazy(() => LoginHistoryUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => LoginHistoryCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => LoginHistoryCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema), z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const LoginHistoryCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.LoginHistoryCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryCreateNestedManyWithoutUserInput>;
export const LoginHistoryCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
