import {
  pgTable,
  varchar,
  jsonb,
  json,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

export const vectorStore = pgTable("vector_store", {
  id: serial("id").primaryKey().notNull(),
  youtubeLink: varchar("youtube_link", { length: 512 }), // Adjust the length based on expected URL length
  vectorData: jsonb("vector_data"),
  embeddingsConfig: json("embeddings_config"),
  createdAt: timestamp("created_at").defaultNow(),
});
