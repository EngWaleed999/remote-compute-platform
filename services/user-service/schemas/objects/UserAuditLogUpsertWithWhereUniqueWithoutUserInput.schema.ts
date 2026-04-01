import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogWhereUniqueInputObjectSchema as UserAuditLogWhereUniqueInputObjectSchema } from './UserAuditLogWhereUniqueInput.schema';
import { UserAuditLogUpdateWithoutUserInputObjectSchema as UserAuditLogUpdateWithoutUserInputObjectSchema } from './UserAuditLogUpdateWithoutUserInput.schema';
import { UserAuditLogUncheckedUpdateWithoutUserInputObjectSchema as UserAuditLogUncheckedUpdateWithoutUserInputObjectSchema } from './UserAuditLogUncheckedUpdateWithoutUserInput.schema';
import { UserAuditLogCreateWithoutUserInputObjectSchema as UserAuditLogCreateWithoutUserInputObjectSchema } from './UserAuditLogCreateWithoutUserInput.schema';
import { UserAuditLogUncheckedCreateWithoutUserInputObjectSchema as UserAuditLogUncheckedCreateWithoutUserInputObjectSchema } from './UserAuditLogUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserAuditLogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UserAuditLogUpdateWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => UserAuditLogCreateWithoutUserInputObjectSchema), z.lazy(() => UserAuditLogUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const UserAuditLogUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.UserAuditLogUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogUpsertWithWhereUniqueWithoutUserInput>;
export const UserAuditLogUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
