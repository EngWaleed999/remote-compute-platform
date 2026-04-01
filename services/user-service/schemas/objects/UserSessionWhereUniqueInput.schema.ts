import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional()
}).strict();
export const UserSessionWhereUniqueInputObjectSchema: z.ZodType<Prisma.UserSessionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionWhereUniqueInput>;
export const UserSessionWhereUniqueInputObjectZodSchema = makeSchema();
