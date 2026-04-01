import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionCreateManyUserInputObjectSchema as UserSessionCreateManyUserInputObjectSchema } from './UserSessionCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => UserSessionCreateManyUserInputObjectSchema), z.lazy(() => UserSessionCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const UserSessionCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.UserSessionCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionCreateManyUserInputEnvelope>;
export const UserSessionCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
