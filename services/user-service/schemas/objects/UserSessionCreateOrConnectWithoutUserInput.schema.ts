import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionWhereUniqueInputObjectSchema as UserSessionWhereUniqueInputObjectSchema } from './UserSessionWhereUniqueInput.schema';
import { UserSessionCreateWithoutUserInputObjectSchema as UserSessionCreateWithoutUserInputObjectSchema } from './UserSessionCreateWithoutUserInput.schema';
import { UserSessionUncheckedCreateWithoutUserInputObjectSchema as UserSessionUncheckedCreateWithoutUserInputObjectSchema } from './UserSessionUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserSessionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserSessionCreateWithoutUserInputObjectSchema), z.lazy(() => UserSessionUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const UserSessionCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.UserSessionCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionCreateOrConnectWithoutUserInput>;
export const UserSessionCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
