-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('PENDING_SETUP', 'AVAILABLE', 'BOOKED', 'MAINTENANCE', 'OFFLINE', 'RETIRED');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SnapshotStatus" AS ENUM ('CREATING', 'UPLOADING', 'READY', 'RESTORING', 'DELETED', 'FAILED');

-- CreateTable
CREATE TABLE "machines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "capabilities" TEXT[],
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "minimumHours" INTEGER NOT NULL DEFAULT 1,
    "region" TEXT NOT NULL,
    "datacenter" TEXT,
    "status" "MachineStatus" NOT NULL DEFAULT 'PENDING_SETUP',
    "healthStatus" "HealthStatus" NOT NULL DEFAULT 'UNKNOWN',
    "vncPort" INTEGER NOT NULL DEFAULT 5900,
    "internalIp" TEXT NOT NULL,
    "lastSeenAt" TIMESTAMP(3),
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine_specs" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "cpuCores" INTEGER NOT NULL,
    "gpu" TEXT,
    "gpuMemory" TEXT,
    "ram" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "network" TEXT NOT NULL,

    CONSTRAINT "machine_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_logs" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "cpuUsage" DOUBLE PRECISION,
    "memoryUsage" DOUBLE PRECISION,
    "diskUsage" DOUBLE PRECISION,
    "gpuUsage" DOUBLE PRECISION,
    "gpuTemperature" DOUBLE PRECISION,
    "networkLatency" INTEGER,
    "status" "HealthStatus" NOT NULL,
    "message" TEXT,
    "activeBookingId" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshots" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "s3Bucket" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "sizeGB" INTEGER NOT NULL,
    "checksum" TEXT,
    "status" "SnapshotStatus" NOT NULL DEFAULT 'CREATING',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_windows" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_windows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machines_name_key" ON "machines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "machines_hostname_key" ON "machines"("hostname");

-- CreateIndex
CREATE INDEX "machines_ownerId_idx" ON "machines"("ownerId");

-- CreateIndex
CREATE INDEX "machines_status_idx" ON "machines"("status");

-- CreateIndex
CREATE INDEX "machines_healthStatus_idx" ON "machines"("healthStatus");

-- CreateIndex
CREATE INDEX "machines_region_idx" ON "machines"("region");

-- CreateIndex
CREATE INDEX "machines_capabilities_idx" ON "machines"("capabilities");

-- CreateIndex
CREATE INDEX "machines_hourlyRate_idx" ON "machines"("hourlyRate");

-- CreateIndex
CREATE UNIQUE INDEX "machine_specs_machineId_key" ON "machine_specs"("machineId");

-- CreateIndex
CREATE INDEX "health_logs_machineId_checkedAt_idx" ON "health_logs"("machineId", "checkedAt");

-- CreateIndex
CREATE INDEX "health_logs_status_idx" ON "health_logs"("status");

-- CreateIndex
CREATE INDEX "health_logs_checkedAt_idx" ON "health_logs"("checkedAt");

-- CreateIndex
CREATE INDEX "snapshots_machineId_idx" ON "snapshots"("machineId");

-- CreateIndex
CREATE INDEX "snapshots_createdByUserId_idx" ON "snapshots"("createdByUserId");

-- CreateIndex
CREATE INDEX "snapshots_status_idx" ON "snapshots"("status");

-- CreateIndex
CREATE INDEX "maintenance_windows_machineId_startsAt_idx" ON "maintenance_windows"("machineId", "startsAt");

-- AddForeignKey
ALTER TABLE "machine_specs" ADD CONSTRAINT "machine_specs_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_logs" ADD CONSTRAINT "health_logs_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_windows" ADD CONSTRAINT "maintenance_windows_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
