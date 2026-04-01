import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserScalarRelationFilterObjectSchema as UserScalarRelationFilterObjectSchema } from './UserScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const loginhistorywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => LoginHistoryWhereInputObjectSchema), z.lazy(() => LoginHistoryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => LoginHistoryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => LoginHistoryWhereInputObjectSchema), z.lazy(() => LoginHistoryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  success: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  method: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ipAddress: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userAgent: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  deviceType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  failureReason: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  user: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional()
}).strict();
export const LoginHistoryWhereInputObjectSchema: z.ZodType<Prisma.LoginHistoryWhereInput> = loginhistorywhereinputSchema as unknown as z.ZodType<Prisma.LoginHistoryWhereInput>;
export const LoginHistoryWhereInputObjectZodSchema = loginhistorywhereinputSchema;
