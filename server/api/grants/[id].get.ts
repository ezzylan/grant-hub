import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const grants = await useDrizzle()
    .select()
    .from(tables.grants)
    .where(eq(tables.grants.id, Number(id)));

  return grants[0];
});
