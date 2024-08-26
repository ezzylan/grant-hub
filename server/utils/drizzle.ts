import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

export const tables = schema;

export function useDrizzle() {
  const { turso } = useRuntimeConfig();

  return drizzle(
    createClient({
      // url: "file:local.db",
      url: turso.databaseUrl,
      authToken: turso.authToken,
    }),
  );
}

export type InsertGrant = typeof schema.grants.$inferInsert;
export type SelectGrant = typeof schema.grants.$inferSelect;

export type InsertUser = typeof schema.users.$inferInsert;
export type SelectUser = typeof schema.users.$inferSelect;
