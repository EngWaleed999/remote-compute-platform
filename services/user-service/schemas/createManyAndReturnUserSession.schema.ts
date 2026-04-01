import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserSessionSelectObjectSchema as UserSessionSelectObjectSchema } from './objects/UserSessionSelect.schema';
import { UserSessionCreateManyInputObjectSchema as UserSessionCreateManyInputObjectSchema } from './objects/UserSessionCreateManyInput.schema';

export const UserSessionCreateManyAndReturnSchema: z.ZodType<Prisma.UserSessionCreateManyAndReturnArgs> = z.object({ select: UserSessionSelectObjectSchema.optional(), data: z.union([ UserSessionCreateManyInputObjectSchema, z.array(UserSessionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.UserSessionCreateManyAndReturnArgs>;

export const UserSessionCreateManyAndReturnZodSchema = z.object({ select: UserSessionSelectObjectSchema.optional(), data: z.union([ UserSessionCreateManyInputObjectSchema, z.array(UserSessionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();