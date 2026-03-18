-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "referenceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_referenceId_key" ON "Transaction"("referenceId");
