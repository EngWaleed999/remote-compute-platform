import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserStatusSchema } from '../enums/UserStatus.schema'

const makeSchema = () => z.object({
  set: UserStatusSchema.optional()
}).strict();
export const EnumUserStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumUserStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumUserStatusFieldUpdateOperationsInput>;
export const EnumUserStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
