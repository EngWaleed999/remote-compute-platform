import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionCreateManyInputObjectSchema as UserSessionCreateManyInputObjectSchema } from './objects/UserSessionCreateManyInput.schema';

export const UserSessionCreateManySchema: z.ZodType<Prisma.UserSessionCreateManyArgs> = z.object({ data: z.union([ UserSessionCreateManyInputObjectSchema, z.array(UserSessionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.UserSessionCreateManyArgs>;

export const UserSessionCreateManyZodSchema = z.object({ data: z.union([ UserSessionCreateManyInputObjectSchema, z.array(UserSessionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();