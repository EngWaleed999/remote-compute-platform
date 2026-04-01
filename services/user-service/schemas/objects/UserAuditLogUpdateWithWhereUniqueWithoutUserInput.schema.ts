import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './UserAuditLogWhereUniqueInput.schema';
import { UserAuditLogUpdateWithoutUserInputObjectSchema as UserAuditLogUpdateWithoutUserInputObjectSchema } from './UserAuditLogUpdateWithoutUserInput.schema';
import { UserAuditLogUncheckedUpdateWithoutUserInputObjectSchema as UserAuditLogUncheckedUpdateWithoutUserInputObjectSchema } from './UserAuditLogUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UserAuditLogUpdateWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const UserAuditLogUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.UserAuditLogUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogUpdateWithWhereUniqueWithoutUserInput>;
export const UserAuditLogUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
