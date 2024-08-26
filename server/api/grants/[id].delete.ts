import { and, eq } from "drizzle-orm";
import { deleteGrant } from "~/utils/abilities";

export default defineEventHandler(async (event) => {
  await authorize(event, deleteGrant);
  const { id } = getRouterParams(event);

  const deletedGrant = await useDrizzle()
    .delete(tables.grants)
    .where(and(eq(tables.grants.id, Number(id))));

  if (!deletedGrant) {
    throw createError({
      statusCode: 404,
      message: "Grant not found",
    });
  }

  return deletedGrant;
});
