CREATE TABLE IF NOT EXISTS "vector_store" (
	"id" serial PRIMARY KEY NOT NULL,
	"youtube_link" varchar(512),
	"vector_data" jsonb,
	"embeddings_config" json,
	"created_at" timestamp DEFAULT now()
);
