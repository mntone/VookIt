/*
  Warnings:

  - You are about to drop the column `count` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `endedBy` on the `Upload` table. All the data in the column will be lost.
  - Made the column `filehash` on table `Upload` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Upload" (
    "cuid" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT,
    "filesize" INTEGER NOT NULL DEFAULT -1,
    "filehash" TEXT NOT NULL,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Upload" ("cuid", "filename", "filehash", "started_at") SELECT "uuid", "filename", "hash", "startedBy" FROM "Upload";
DROP TABLE "Upload";
ALTER TABLE "new_Upload" RENAME TO "Upload";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
