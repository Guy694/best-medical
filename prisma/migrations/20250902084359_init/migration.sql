/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Contact";

-- CreateTable
CREATE TABLE "public"."contact" (
    "contactsID" SERIAL NOT NULL,
    "contacts_name" TEXT NOT NULL,
    "contacts_email" TEXT NOT NULL,
    "contacts_phone" TEXT,
    "contacts_article" TEXT,
    "contacts_detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("contactsID")
);

-- CreateTable
CREATE TABLE "public"."articles" (
    "articleID" SERIAL NOT NULL,
    "article_title" TEXT NOT NULL,
    "article_content" TEXT NOT NULL,
    "article_author" TEXT NOT NULL,
    "article_banner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("articleID")
);
