-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "Log_email_idx" ON "Log"("email");

-- CreateIndex
CREATE INDEX "Log_problemId_idx" ON "Log"("problemId");
