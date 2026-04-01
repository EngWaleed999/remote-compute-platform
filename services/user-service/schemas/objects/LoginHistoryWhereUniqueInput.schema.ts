import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const LoginHistoryWhereUniqueInputObjectSchema: z.ZodType<Prisma.LoginHistoryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryWhereUniqueInput>;
export const LoginHistoryWhereUniqueInputObjectZodSchema = makeSchema();
