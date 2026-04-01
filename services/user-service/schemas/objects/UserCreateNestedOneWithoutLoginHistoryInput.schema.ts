import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutLoginHistoryInputObjectSchema as UserCreateWithoutLoginHistoryInputObjectSchema } from './UserCreateWithoutLoginHistoryInput.schema';
import { UserUncheckedCreateWithoutLoginHistoryInputObjectSchema as UserUncheckedCreateWithoutLoginHistoryInputObjectSchema } from './UserUncheckedCreateWithoutLoginHistoryInput.schema';
import { UserCreateOrConnectWithoutLoginHistoryInputObjectSchema as UserCreateOrConnectWithoutLoginHistoryInputObjectSchema } from './UserCreateOrConnectWithoutLoginHistoryInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutLoginHistoryInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutLoginHistoryInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutLoginHistoryInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutLoginHistoryInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutLoginHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutLoginHistoryInput>;
export const UserCreateNestedOneWithoutLoginHistoryInputObjectZodSchema = makeSchema();
