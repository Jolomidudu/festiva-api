-- CreateTable
CREATE TABLE "EventScheduleItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "location" TEXT,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventScheduleItem_eventId_startTime_idx" ON "EventScheduleItem"("eventId", "startTime");

-- AddForeignKey
ALTER TABLE "EventScheduleItem" ADD CONSTRAINT "EventScheduleItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
