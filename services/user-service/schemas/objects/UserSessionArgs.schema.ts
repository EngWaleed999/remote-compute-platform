import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './UserSessionSelect.schema';
import { UserSessionIncludeObjectSchema as UserSessionIncludeObjectSchema } from './UserSessionInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => UserSessionSelectObjectSchema).optional(),
  include: z.lazy(() => UserSessionIncludeObjectSchema).optional()
}).strict();
export const UserSessionArgsObjectSchema = makeSchema();
export const UserSessionArgsObjectZodSchema = makeSchema();
