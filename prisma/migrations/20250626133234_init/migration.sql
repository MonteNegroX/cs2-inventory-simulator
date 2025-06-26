-- CreateTable
CREATE TABLE "User" (
    "avatar" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "inventory" TEXT,
    "name" TEXT NOT NULL,
    "syncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserCache" (
    "args" TEXT,
    "body" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("url", "userId"),
    CONSTRAINT "UserCache_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "background" TEXT,
    "hideFilters" TEXT,
    "hideFreeItems" TEXT,
    "hideNewItemLabel" TEXT,
    "language" TEXT,
    "statsForNerds" TEXT,
    "userId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApiCredential" (
    "apiKey" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scope" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApiAuthToken" (
    "apiKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ApiAuthToken_apiKey_fkey" FOREIGN KEY ("apiKey") REFERENCES "ApiCredential" ("apiKey") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApiAuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rule" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'string',
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserRule" (
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    PRIMARY KEY ("name", "userId"),
    CONSTRAINT "UserRule_name_fkey" FOREIGN KEY ("name") REFERENCES "Rule" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "priority" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("groupId", "userId"),
    CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GroupRule" (
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    PRIMARY KEY ("groupId", "name"),
    CONSTRAINT "GroupRule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GroupRule_name_fkey" FOREIGN KEY ("name") REFERENCES "Rule" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Rule_name_key" ON "Rule"("name");
