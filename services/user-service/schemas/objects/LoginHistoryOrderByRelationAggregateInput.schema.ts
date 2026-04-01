import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const LoginHistoryOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.LoginHistoryOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryOrderByRelationAggregateInput>;
export const LoginHistoryOrderByRelationAggregateInputObjectZodSchema = makeSchema();
