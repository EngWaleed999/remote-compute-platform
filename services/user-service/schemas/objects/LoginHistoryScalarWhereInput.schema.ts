import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const loginhistoryscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => LoginHistoryScalarWhereInputObjectSchema), z.lazy(() => LoginHistoryScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => LoginHistoryScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => LoginHistoryScalarWhereInputObjectSchema), z.lazy(() => LoginHistoryScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  success: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  method: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ipAddress: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userAgent: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  deviceType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  failureReason: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const LoginHistoryScalarWhereInputObjectSchema: z.ZodType<Prisma.LoginHistoryScalarWhereInput> = loginhistoryscalarwhereinputSchema as unknown as z.ZodType<Prisma.LoginHistoryScalarWhereInput>;
export const LoginHistoryScalarWhereInputObjectZodSchema = loginhistoryscalarwhereinputSchema;
