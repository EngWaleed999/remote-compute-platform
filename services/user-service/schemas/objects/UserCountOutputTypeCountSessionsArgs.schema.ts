import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionWhereInputObjectSchema as UserSessionWhereInputObjectSchema } from './UserSessionWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserSessionWhereInputObjectSchema).optional()
}).strict();
export const UserCountOutputTypeCountSessionsArgsObjectSchema = makeSchema();
export const UserCountOutputTypeCountSessionsArgsObjectZodSchema = makeSchema();
