import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { CharacterTextSplitter } from "langchain/text_splitter";
import OpenAI from "openai";
import { config } from "dotenv";
import zlib from "zlib";
import { promisify } from "util";
import { db } from "./db";
import { vectorStore } from "./schema";
import { eq } from "drizzle-orm";

config({ path: ".env" });

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createYoutubeVideoStore = async (youtubeLink) => {
  console.log({ youtubeLink });
  const loader = YoutubeLoader.createFromUrl(youtubeLink, {
    language: "en",
    addVideoInfo: true,
  });
  console.log({ loader });

  try {
    const docs = await loader.loadAndSplit(
      new CharacterTextSplitter({
        separator: " ",
        chunkSize: 2500,
        chunkOverlap: 100,
      })
    );

    console.log({ docs });

    const store = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );

    const uncompressedData = JSON.stringify(store.memoryVectors);
    const vectorData = await gzip(Buffer.from(uncompressedData));
    const embeddingsConfig = {
      modelName: store.embeddings.modelName,
      batchSize: store.embeddings.batchSize,
    };

    const memVectorStore = await db.insert(vectorStore).values({
      youtubeLink,
      vectorData,
      embeddingsConfig,
    });

    return memVectorStore;
  } catch (error) {
    console.error("Failed to create YouTube video store:", error);
    throw error;
  }
};

export const getAIResponse = async (youtubeLink, chatHistory) => {
  try {
    const vectorStoreEntry = await db
      .select()
      .from(vectorStore)
      .where(eq(vectorStore.youtubeLink, youtubeLink));

    const buffer = Buffer.from(vectorStoreEntry[0].vectorData.data);
    const decompressedData = await gunzip(buffer);
    const dataString = decompressedData.toString("utf-8");
    const memoryVectors = JSON.parse(dataString);

    const embeddings = new OpenAIEmbeddings({
      modelName: vectorStoreEntry[0].embeddingsConfig.modelName,
      batchSize: vectorStoreEntry[0].embeddingsConfig.batchSize,
    });

    const store = new MemoryVectorStore(embeddings);

    store.memoryVectors = memoryVectors;

    const userQuery = chatHistory[chatHistory.length - 1].content;

    const results = await store.similaritySearch(userQuery, 2);

    const newQuestion = {
      role: "user",
      content: `Please answer the following question based on the provided context. If the context is insufficient, let me know that more information is needed rather than making something up.
                Question: ${userQuery}
                Context: ${results.map((r) => r.pageContent).join("\n")}`,
    };
    chatHistory[chatHistory.length - 1] = newQuestion;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.5,
      messages: chatHistory,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw error;
  }
};
