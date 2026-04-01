import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionWhereInputObjectSchema as UserSessionWhereInputObjectSchema } from './UserSessionWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => UserSessionWhereInputObjectSchema).optional(),
  some: z.lazy(() => UserSessionWhereInputObjectSchema).optional(),
  none: z.lazy(() => UserSessionWhereInputObjectSchema).optional()
}).strict();
export const UserSessionListRelationFilterObjectSchema: z.ZodType<Prisma.UserSessionListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionListRelationFilter>;
export const UserSessionListRelationFilterObjectZodSchema = makeSchema();
