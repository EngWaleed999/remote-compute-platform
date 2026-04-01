import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogScalarWhereInputObjectSchema as UserAuditLogScalarWhereInputObjectSchema } from './UserAuditLogScalarWhereInput.schema';
import { UserAuditLogUpdateManyMutationInputObjectSchema as UserAuditLogUpdateManyMutationInputObjectSchema } from './UserAuditLogUpdateManyMutationInput.schema';
import { UserAuditLogUncheckedUpdateManyWithoutUserInputObjectSchema as UserAuditLogUncheckedUpdateManyWithoutUserInputObjectSchema } from './UserAuditLogUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserAuditLogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UserAuditLogUpdateManyMutationInputObjectSchema), z.lazy(() => UserAuditLogUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const UserAuditLogUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.UserAuditLogUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogUpdateManyWithWhereWithoutUserInput>;
export const UserAuditLogUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
