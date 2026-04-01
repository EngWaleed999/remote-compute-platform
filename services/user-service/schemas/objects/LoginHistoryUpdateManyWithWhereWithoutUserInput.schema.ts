import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryScalarWhereInputObjectSchema as LoginHistoryScalarWhereInputObjectSchema } from './LoginHistoryScalarWhereInput.schema';
import { LoginHistoryUpdateManyMutationInputObjectSchema as LoginHistoryUpdateManyMutationInputObjectSchema } from './LoginHistoryUpdateManyMutationInput.schema';
import { LoginHistoryUncheckedUpdateManyWithoutUserInputObjectSchema as LoginHistoryUncheckedUpdateManyWithoutUserInputObjectSchema } from './LoginHistoryUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => LoginHistoryScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => LoginHistoryUpdateManyMutationInputObjectSchema), z.lazy(() => LoginHistoryUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const LoginHistoryUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.LoginHistoryUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryUpdateManyWithWhereWithoutUserInput>;
export const LoginHistoryUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
