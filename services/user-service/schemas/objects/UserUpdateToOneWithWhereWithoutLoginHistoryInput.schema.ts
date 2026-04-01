import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutLoginHistoryInputObjectSchema as UserUpdateWithoutLoginHistoryInputObjectSchema } from './UserUpdateWithoutLoginHistoryInput.schema';
import { UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema as UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema } from './UserUncheckedUpdateWithoutLoginHistoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutLoginHistoryInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutLoginHistoryInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutLoginHistoryInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutLoginHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutLoginHistoryInput>;
export const UserUpdateToOneWithWhereWithoutLoginHistoryInputObjectZodSchema = makeSchema();
