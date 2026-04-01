import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const UserSessionOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.UserSessionOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionOrderByRelationAggregateInput>;
export const UserSessionOrderByRelationAggregateInputObjectZodSchema = makeSchema();
