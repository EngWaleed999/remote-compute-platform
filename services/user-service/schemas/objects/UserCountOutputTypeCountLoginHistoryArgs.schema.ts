import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryWhereInputObjectSchema as LoginHistoryWhereInputObjectSchema } from './LoginHistoryWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => LoginHistoryWhereInputObjectSchema).optional()
}).strict();
export const UserCountOutputTypeCountLoginHistoryArgsObjectSchema = makeSchema();
export const UserCountOutputTypeCountLoginHistoryArgsObjectZodSchema = makeSchema();
