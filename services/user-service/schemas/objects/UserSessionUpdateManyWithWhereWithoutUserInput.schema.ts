import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionScalarWhereInputObjectSchema as UserSessionScalarWhereInputObjectSchema } from './UserSessionScalarWhereInput.schema';
import { UserSessionUpdateManyMutationInputObjectSchema as UserSessionUpdateManyMutationInputObjectSchema } from './UserSessionUpdateManyMutationInput.schema';
import { UserSessionUncheckedUpdateManyWithoutUserInputObjectSchema as UserSessionUncheckedUpdateManyWithoutUserInputObjectSchema } from './UserSessionUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserSessionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UserSessionUpdateManyMutationInputObjectSchema), z.lazy(() => UserSessionUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const UserSessionUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.UserSessionUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionUpdateManyWithWhereWithoutUserInput>;
export const UserSessionUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
