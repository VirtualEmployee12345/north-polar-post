-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FULFILLED', 'FAILED');

-- CreateEnum
CREATE TYPE "LetterStatus" AS ENUM ('PENDING', 'QUEUED', 'SENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT,
    "childName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "goodDeed" TEXT NOT NULL,
    "specialWish" TEXT NOT NULL,
    "shippingAddress" JSONB,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 39.99,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "originalSchedule" JSONB,
    "adjustedSchedule" JSONB,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Order_stripeCheckoutSessionId_key" UNIQUE ("stripeCheckoutSessionId")
);

-- CreateTable
CREATE TABLE "Letter" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "status" "LetterStatus" NOT NULL DEFAULT 'PENDING',
    "sendDate" TIMESTAMP(3) NOT NULL,
    "sentDate" TIMESTAMP(3),
    "handwryttenCardId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessedStripeSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedStripeSession_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProcessedStripeSession_sessionId_key" UNIQUE ("sessionId")
);

-- CreateTable
CREATE TABLE "FailedLetter" (
    "id" TEXT NOT NULL,
    "letterId" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "attempts" JSONB NOT NULL,
    "lastAttemptAt" TIMESTAMP(3) NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FailedLetter_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "FailedLetter_letterId_key" UNIQUE ("letterId")
);

-- CreateIndex
CREATE INDEX "Letter_orderId_idx" ON "Letter"("orderId");

-- CreateIndex
CREATE INDEX "Letter_status_sendDate_idx" ON "Letter"("status", "sendDate");

-- CreateIndex
CREATE INDEX "FailedLetter_resolved_lastAttemptAt_idx" ON "FailedLetter"("resolved", "lastAttemptAt");

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FailedLetter" ADD CONSTRAINT "FailedLetter_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter"("id") ON DELETE CASCADE ON UPDATE CASCADE;