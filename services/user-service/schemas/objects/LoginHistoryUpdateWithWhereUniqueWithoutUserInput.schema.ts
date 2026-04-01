import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './LoginHistoryWhereUniqueInput.schema';
import { LoginHistoryUpdateWithoutUserInputObjectSchema as LoginHistoryUpdateWithoutUserInputObjectSchema } from './LoginHistoryUpdateWithoutUserInput.schema';
import { LoginHistoryUncheckedUpdateWithoutUserInputObjectSchema as LoginHistoryUncheckedUpdateWithoutUserInputObjectSchema } from './LoginHistoryUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => LoginHistoryUpdateWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const LoginHistoryUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.LoginHistoryUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryUpdateWithWhereUniqueWithoutUserInput>;
export const LoginHistoryUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
