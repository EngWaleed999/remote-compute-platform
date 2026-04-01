import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryWhereUniqueInputObjectSchema as LoginHistoryWhereUniqueInputObjectSchema } from './LoginHistoryWhereUniqueInput.schema';
import { LoginHistoryCreateWithoutUserInputObjectSchema as LoginHistoryCreateWithoutUserInputObjectSchema } from './LoginHistoryCreateWithoutUserInput.schema';
import { LoginHistoryUncheckedCreateWithoutUserInputObjectSchema as LoginHistoryUncheckedCreateWithoutUserInputObjectSchema } from './LoginHistoryUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => LoginHistoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => LoginHistoryCreateWithoutUserInputObjectSchema), z.lazy(() => LoginHistoryUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const LoginHistoryCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.LoginHistoryCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryCreateOrConnectWithoutUserInput>;
export const LoginHistoryCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
