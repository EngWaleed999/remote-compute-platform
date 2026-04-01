import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserSessionOrderByRelationAggregateInputObjectSchema as UserSessionOrderByRelationAggregateInputObjectSchema } from './UserSessionOrderByRelationAggregateInput.schema';
import { LoginHistoryOrderByRelationAggregateInputObjectSchema as LoginHistoryOrderByRelationAggregateInputObjectSchema } from './LoginHistoryOrderByRelationAggregateInput.schema';
import { UserAuditLogOrderByRelationAggregateInputObjectSchema as UserAuditLogOrderByRelationAggregateInputObjectSchema } from './UserAuditLogOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  passwordHash: SortOrderSchema.optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  avatarUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  timezone: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  emailVerified: SortOrderSchema.optional(),
  twoFactorEnabled: SortOrderSchema.optional(),
  twoFactorSecret: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultPaymentMethodId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  stripeCustomerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lastLoginAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  deletedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sessions: z.lazy(() => UserSessionOrderByRelationAggregateInputObjectSchema).optional(),
  loginHistory: z.lazy(() => LoginHistoryOrderByRelationAggregateInputObjectSchema).optional(),
  auditLogs: z.lazy(() => UserAuditLogOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const UserOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserOrderByWithRelationInput>;
export const UserOrderByWithRelationInputObjectZodSchema = makeSchema();
