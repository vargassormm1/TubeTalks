-- CreateTable
CREATE TABLE "VectorStore" (
    "id" SERIAL NOT NULL,
    "youtubeLink" TEXT NOT NULL,
    "vectorData" BYTEA NOT NULL,
    "embeddingsConfig" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VectorStore_pkey" PRIMARY KEY ("id")
);
