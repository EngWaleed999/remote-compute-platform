import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionCreateWithoutUserInputObjectSchema as UserSessionCreateWithoutUserInputObjectSchema } from './UserSessionCreateWithoutUserInput.schema';
import { UserSessionUncheckedCreateWithoutUserInputObjectSchema as UserSessionUncheckedCreateWithoutUserInputObjectSchema } from './UserSessionUncheckedCreateWithoutUserInput.schema';
import { UserSessionCreateOrConnectWithoutUserInputObjectSchema as UserSessionCreateOrConnectWithoutUserInputObjectSchema } from './UserSessionCreateOrConnectWithoutUserInput.schema';
import { UserSessionCreateManyUserInputEnvelopeObjectSchema as UserSessionCreateManyUserInputEnvelopeObjectSchema } from './UserSessionCreateManyUserInputEnvelope.schema';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './UserSessionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserSessionCreateWithoutUserInputObjectSchema), z.lazy(() => UserSessionCreateWithoutUserInputObjectSchema).array(), z.lazy(() => UserSessionUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => UserSessionUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UserSessionCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => UserSessionCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => UserSessionCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => UserSessionWhereUniqueInputObjectSchema), z.lazy(() => UserSessionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const UserSessionCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.UserSessionCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionCreateNestedManyWithoutUserInput>;
export const UserSessionCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
