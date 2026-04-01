import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LoginHistorySelectObjectSchema as LoginHistorySelectObjectSchema } from './LoginHistorySelect.schema';
import { LoginHistoryIncludeObjectSchema as LoginHistoryIncludeObjectSchema } from './LoginHistoryInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => LoginHistorySelectObjectSchema).optional(),
  include: z.lazy(() => LoginHistoryIncludeObjectSchema).optional()
}).strict();
export const LoginHistoryArgsObjectSchema = makeSchema();
export const LoginHistoryArgsObjectZodSchema = makeSchema();
