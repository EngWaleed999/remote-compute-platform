import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './LoginHistoryWhereUniqueInput.schema';
import { LoginHistoryUpdateWithoutUserInputObjectSchema as LoginHistoryUpdateWithoutUserInputObjectSchema } from './LoginHistoryUpdateWithoutUserInput.schema';
import { LoginHistoryUncheckedUpdateWithoutUserInputObjectSchema as LoginHistoryUncheckedUpdateWithoutUserInputObjectSchema } from './LoginHistoryUncheckedUpdateWithoutUserInput.schema';
import { LoginHistoryCreateWithoutUserInputObjectSchema as LoginHistoryCreateWithoutUserInputObjectSchema } from './LoginHistoryCreateWithoutUserInput.schema';
import { LoginHistoryUncheckedCreateWithoutUserInputObjectSchema as LoginHistoryUncheckedCreateWithoutUserInputObjectSchema } from './LoginHistoryUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => LoginHistoryUpdateWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => LoginHistoryCreateWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const LoginHistoryUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.LoginHistoryUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryUpsertWithWhereUniqueWithoutUserInput>;
export const LoginHistoryUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
