/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Game";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "bannerUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "yearsPlaying" INTEGER NOT NULL,
    "discord" TEXT NOT NULL,
    "weekDays" TEXT NOT NULL,
    "hourStart" INTEGER NOT NULL,
    "hourEnd" INTEGER NOT NULL,
    "useVoiceChannel" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ads_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
