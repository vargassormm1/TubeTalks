import OpenAI from "openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { CharacterTextSplitter } from "langchain/text_splitter";
import prisma from "./db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createYoutubeVideoStore = async (youtubeLink) => {
  const loader = YoutubeLoader.createFromUrl(youtubeLink, {
    language: "en",
    addVideoInfo: true,
  });

  const docs = await loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: " ",
      chunkSize: 2500,
      chunkOverlap: 100,
    })
  );

  const store = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings()
  );

  const vectorData = Buffer.from(JSON.stringify(store.memoryVectors));
  const embeddingsConfig = {
    modelName: store.embeddings.modelName,
    batchSize: store.embeddings.batchSize,
  };
  const vectorStore = await prisma.vectorStore.create({
    data: {
      youtubeLink,
      vectorData,
      embeddingsConfig,
    },
  });

  return vectorStore;
};

export const getAIResponse = async (youtubeLink, chatHistory) => {
  const vectorStoreEntry = await prisma.vectorStore.findFirst({
    where: {
      youtubeLink: youtubeLink,
    },
  });

  const jsonString = vectorStoreEntry.vectorData.toString();
  const memoryVectors = JSON.parse(jsonString);

  const embeddings = new OpenAIEmbeddings({
    modelName: vectorStoreEntry.embeddingsConfig.modelName,
    batchSize: vectorStoreEntry.embeddingsConfig.batchSize,
  });

  const store = new MemoryVectorStore(embeddings);

  store.memoryVectors = memoryVectors;

  const userQuery = chatHistory[chatHistory.length - 1].content;

  const results = await store.similaritySearch(userQuery, 2);

  const newQuestion = {
    role: "user",
    content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
          Question: ${userQuery}
          Context: ${results.map((r) => r.pageContent).join("\n")}`,
  };
  chatHistory[chatHistory.length - 1] = newQuestion;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: chatHistory,
  });

  return response.choices[0].message.content;
};
