import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_players_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__players_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "players_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "players" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"height" numeric,
  	"weight" numeric,
  	"image_id" integer,
  	"position" varchar,
  	"shirt_number" numeric,
  	"country" varchar,
  	"bio" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_players_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_players_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_players_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_date_of_birth" timestamp(3) with time zone,
  	"version_height" numeric,
  	"version_weight" numeric,
  	"version_image_id" integer,
  	"version_position" varchar,
  	"version_shirt_number" numeric,
  	"version_country" varchar,
  	"version_bio" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__players_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';
  ALTER TABLE "forms_blocks_select" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "players_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_kv_id" integer;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "players_populated_authors" ADD CONSTRAINT "players_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "players" ADD CONSTRAINT "players_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players" ADD CONSTRAINT "players_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_players_v_version_populated_authors" ADD CONSTRAINT "_players_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_players_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_players_v" ADD CONSTRAINT "_players_v_parent_id_players_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_players_v" ADD CONSTRAINT "_players_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_players_v" ADD CONSTRAINT "_players_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "players_populated_authors_order_idx" ON "players_populated_authors" USING btree ("_order");
  CREATE INDEX "players_populated_authors_parent_id_idx" ON "players_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "players_image_idx" ON "players" USING btree ("image_id");
  CREATE INDEX "players_meta_meta_image_idx" ON "players" USING btree ("meta_image_id");
  CREATE INDEX "players_slug_idx" ON "players" USING btree ("slug");
  CREATE INDEX "players_updated_at_idx" ON "players" USING btree ("updated_at");
  CREATE INDEX "players_created_at_idx" ON "players" USING btree ("created_at");
  CREATE INDEX "players__status_idx" ON "players" USING btree ("_status");
  CREATE INDEX "_players_v_version_populated_authors_order_idx" ON "_players_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_players_v_version_populated_authors_parent_id_idx" ON "_players_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_players_v_parent_idx" ON "_players_v" USING btree ("parent_id");
  CREATE INDEX "_players_v_version_version_image_idx" ON "_players_v" USING btree ("version_image_id");
  CREATE INDEX "_players_v_version_meta_version_meta_image_idx" ON "_players_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_players_v_version_version_slug_idx" ON "_players_v" USING btree ("version_slug");
  CREATE INDEX "_players_v_version_version_updated_at_idx" ON "_players_v" USING btree ("version_updated_at");
  CREATE INDEX "_players_v_version_version_created_at_idx" ON "_players_v" USING btree ("version_created_at");
  CREATE INDEX "_players_v_version_version__status_idx" ON "_players_v" USING btree ("version__status");
  CREATE INDEX "_players_v_created_at_idx" ON "_players_v" USING btree ("created_at");
  CREATE INDEX "_players_v_updated_at_idx" ON "_players_v" USING btree ("updated_at");
  CREATE INDEX "_players_v_latest_idx" ON "_players_v" USING btree ("latest");
  CREATE INDEX "_players_v_autosave_idx" ON "_players_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_players_fk" FOREIGN KEY ("players_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_kv_fk" FOREIGN KEY ("payload_kv_id") REFERENCES "public"."payload_kv"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_players_id_idx" ON "payload_locked_documents_rels" USING btree ("players_id");
  CREATE INDEX "payload_locked_documents_rels_payload_kv_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_kv_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "players_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "players" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_players_v_version_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_players_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "players_populated_authors" CASCADE;
  DROP TABLE "players" CASCADE;
  DROP TABLE "_players_v_version_populated_authors" CASCADE;
  DROP TABLE "_players_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_players_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_kv_fk";
  
  DROP INDEX "payload_locked_documents_rels_players_id_idx";
  DROP INDEX "payload_locked_documents_rels_payload_kv_id_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';
  CREATE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "forms_blocks_select" DROP COLUMN "placeholder";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "players_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_kv_id";
  DROP TYPE "public"."enum_players_status";
  DROP TYPE "public"."enum__players_v_version_status";`)
}
