/*
  Warnings:

  - You are about to drop the column `audioFile` on the `MusicTrack` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `MusicTrack` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MusicTrack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "audioUrl" TEXT,
    "coverImageUrl" TEXT,
    "fileSize" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MusicTrack" ("audioUrl", "category", "createdAt", "featured", "id", "published", "status", "title", "updatedAt") SELECT "audioUrl", "category", "createdAt", "featured", "id", "published", "status", "title", "updatedAt" FROM "MusicTrack";
DROP TABLE "MusicTrack";
ALTER TABLE "new_MusicTrack" RENAME TO "MusicTrack";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
