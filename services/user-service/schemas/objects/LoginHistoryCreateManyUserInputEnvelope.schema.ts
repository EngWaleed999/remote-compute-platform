import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryCreateManyUserInputObjectSchema as LoginHistoryCreateManyUserInputObjectSchema } from './LoginHistoryCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => LoginHistoryCreateManyUserInputObjectSchema), z.lazy(() => LoginHistoryCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const LoginHistoryCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.LoginHistoryCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryCreateManyUserInputEnvelope>;
export const LoginHistoryCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
