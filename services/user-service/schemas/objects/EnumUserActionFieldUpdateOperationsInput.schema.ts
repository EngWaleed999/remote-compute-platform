import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserActionSchema } from '../enums/UserAction.schema'

const makeSchema = () => z.object({
  set: UserActionSchema.optional()
}).strict();
export const EnumUserActionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumUserActionFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumUserActionFieldUpdateOperationsInput>;
export const EnumUserActionFieldUpdateOperationsInputObjectZodSchema = makeSchema();
