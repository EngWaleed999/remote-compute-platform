import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutLoginHistoryInputObjectSchema as UserCreateWithoutLoginHistoryInputObjectSchema } from './UserCreateWithoutLoginHistoryInput.schema';
import { UserUncheckedCreateWithoutLoginHistoryInputObjectSchema as UserUncheckedCreateWithoutLoginHistoryInputObjectSchema } from './UserUncheckedCreateWithoutLoginHistoryInput.schema';
import { UserCreateOrConnectWithoutLoginHistoryInputObjectSchema as UserCreateOrConnectWithoutLoginHistoryInputObjectSchema } from './UserCreateOrConnectWithoutLoginHistoryInput.schema';
import { UserUpsertWithoutLoginHistoryInputObjectSchema as UserUpsertWithoutLoginHistoryInputObjectSchema } from './UserUpsertWithoutLoginHistoryInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutLoginHistoryInputObjectSchema as UserUpdateToOneWithWhereWithoutLoginHistoryInputObjectSchema } from './UserUpdateToOneWithWhereWithoutLoginHistoryInput.schema';
import { UserUpdateWithoutLoginHistoryInputObjectSchema as UserUpdateWithoutLoginHistoryInputObjectSchema } from './UserUpdateWithoutLoginHistoryInput.schema';
import { UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema as UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema } from './UserUncheckedUpdateWithoutLoginHistoryInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutLoginHistoryInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutLoginHistoryInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutLoginHistoryInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutLoginHistoryInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutLoginHistoryInputObjectSchema), z.lazy(() => UserUpdateWithoutLoginHistoryInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutLoginHistoryNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutLoginHistoryNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutLoginHistoryNestedInput>;
export const UserUpdateOneRequiredWithoutLoginHistoryNestedInputObjectZodSchema = makeSchema();
