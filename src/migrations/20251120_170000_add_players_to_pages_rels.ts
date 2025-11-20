import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "pages__rels" ADD COLUMN "players_id" integer;

    ALTER TABLE "pages__rels" ADD CONSTRAINT "pages__rels_players_fk"
      FOREIGN KEY ("players_id") REFERENCES "public"."players"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "pages__rels_players_id_idx"
      ON "pages__rels" USING btree ("players_id");
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "pages__rels" DROP CONSTRAINT "pages__rels_players_fk";

    DROP INDEX "pages__rels_players_id_idx";

    ALTER TABLE "pages__rels" DROP COLUMN "players_id";
  `)
}
