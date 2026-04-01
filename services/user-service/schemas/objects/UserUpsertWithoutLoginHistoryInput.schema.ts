import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutLoginHistoryInputObjectSchema as UserUpdateWithoutLoginHistoryInputObjectSchema } from './UserUpdateWithoutLoginHistoryInput.schema';
import { UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema as UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema } from './UserUncheckedUpdateWithoutLoginHistoryInput.schema';
import { UserCreateWithoutLoginHistoryInputObjectSchema as UserCreateWithoutLoginHistoryInputObjectSchema } from './UserCreateWithoutLoginHistoryInput.schema';
import { UserUncheckedCreateWithoutLoginHistoryInputObjectSchema as UserUncheckedCreateWithoutLoginHistoryInputObjectSchema } from './UserUncheckedCreateWithoutLoginHistoryInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutLoginHistoryInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutLoginHistoryInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutLoginHistoryInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutLoginHistoryInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutLoginHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutLoginHistoryInput>;
export const UserUpsertWithoutLoginHistoryInputObjectZodSchema = makeSchema();
