-- CreateEnum
CREATE TYPE "EventVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateTable
CREATE TABLE "EventPreference" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Lagos',
    "rsvpDeadline" TIMESTAMP(3),
    "allowPlusOne" BOOLEAN NOT NULL DEFAULT false,
    "allowRsvpChanges" BOOLEAN NOT NULL DEFAULT true,
    "showGuestContactInfo" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "EventVisibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventPreference_eventId_key" ON "EventPreference"("eventId");

-- AddForeignKey
ALTER TABLE "EventPreference" ADD CONSTRAINT "EventPreference_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
