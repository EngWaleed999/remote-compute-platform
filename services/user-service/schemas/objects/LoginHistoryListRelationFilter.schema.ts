import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistoryWhereInputObjectSchema as LoginHistoryWhereInputObjectSchema } from './LoginHistoryWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => LoginHistoryWhereInputObjectSchema).optional(),
  some: z.lazy(() => LoginHistoryWhereInputObjectSchema).optional(),
  none: z.lazy(() => LoginHistoryWhereInputObjectSchema).optional()
}).strict();
export const LoginHistoryListRelationFilterObjectSchema: z.ZodType<Prisma.LoginHistoryListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryListRelationFilter>;
export const LoginHistoryListRelationFilterObjectZodSchema = makeSchema();
