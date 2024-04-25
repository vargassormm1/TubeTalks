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

  return store;
};

export const getAIResponse = async (youtubeLink, chatHistory) => {
  const store = await createYoutubeVideoStore(youtubeLink);

  const userQuestion = chatHistory[chatHistory.length - 1];

  const results = await store.similaritySearch(userQuestion.content, 2);

  const newQuestion = {
    role: "user",
    content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
          Question: ${userQuestion}
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
