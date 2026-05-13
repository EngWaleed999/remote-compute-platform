-- DropIndex
DROP INDEX "users_email_key";


-- 1. Make sure to delete any old index (Reserve)

DROP INDEX IF EXISTS "users_email_key";

-- 2. Create Partial unique index

CREATE UNIQUE INDEX "users_email_active_key"
ON "users"("email")
WHERE "deletedAt" IS NULL;
-- THIS tells postgreSQL make sure you do not repeat an email if "deletedAt" IS NULL 