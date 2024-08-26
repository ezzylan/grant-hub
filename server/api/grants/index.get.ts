import { desc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { category } = getQuery(event);

  if (category === "All Grants") {
    return await useDrizzle()
      .select()
      .from(tables.grants)
      .orderBy(desc(tables.grants.id));
  } else {
    return await useDrizzle()
      .select()
      .from(tables.grants)
      .where(eq(tables.grants.category, String(category)))
      .orderBy(desc(tables.grants.id));
  }
});
