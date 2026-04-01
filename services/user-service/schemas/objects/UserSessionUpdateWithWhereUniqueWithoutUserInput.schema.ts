import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './UserSessionWhereUniqueInput.schema';
import { UserSessionUpdateWithoutUserInputObjectSchema as UserSessionUpdateWithoutUserInputObjectSchema } from './UserSessionUpdateWithoutUserInput.schema';
import { UserSessionUncheckedUpdateWithoutUserInputObjectSchema as UserSessionUncheckedUpdateWithoutUserInputObjectSchema } from './UserSessionUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserSessionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UserSessionUpdateWithoutUserInputObjectSchema), z.lazy(() => UserSessionUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const UserSessionUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.UserSessionUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionUpdateWithWhereUniqueWithoutUserInput>;
export const UserSessionUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
