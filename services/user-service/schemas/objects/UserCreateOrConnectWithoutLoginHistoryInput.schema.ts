import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutLoginHistoryInputObjectSchema as UserCreateWithoutLoginHistoryInputObjectSchema } from './UserCreateWithoutLoginHistoryInput.schema';
import { UserUncheckedCreateWithoutLoginHistoryInputObjectSchema as UserUncheckedCreateWithoutLoginHistoryInputObjectSchema } from './UserUncheckedCreateWithoutLoginHistoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutLoginHistoryInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutLoginHistoryInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutLoginHistoryInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutLoginHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutLoginHistoryInput>;
export const UserCreateOrConnectWithoutLoginHistoryInputObjectZodSchema = makeSchema();
