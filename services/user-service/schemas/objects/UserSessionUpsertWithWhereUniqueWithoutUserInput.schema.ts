import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './UserSessionWhereUniqueInput.schema';
import { UserSessionUpdateWithoutUserInputObjectSchema as UserSessionUpdateWithoutUserInputObjectSchema } from './UserSessionUpdateWithoutUserInput.schema';
import { UserSessionUncheckedUpdateWithoutUserInputObjectSchema as UserSessionUncheckedUpdateWithoutUserInputObjectSchema } from './UserSessionUncheckedUpdateWithoutUserInput.schema';
import { UserSessionCreateWithoutUserInputObjectSchema as UserSessionCreateWithoutUserInputObjectSchema } from './UserSessionCreateWithoutUserInput.schema';
import { UserSessionUncheckedCreateWithoutUserInputObjectSchema as UserSessionUncheckedCreateWithoutUserInputObjectSchema } from './UserSessionUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserSessionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UserSessionUpdateWithoutUserInputObjectSchema), z.lazy(() => UserSessionUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => UserSessionCreateWithoutUserInputObjectSchema), z.lazy(() => UserSessionUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const UserSessionUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.UserSessionUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionUpsertWithWhereUniqueWithoutUserInput>;
export const UserSessionUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
