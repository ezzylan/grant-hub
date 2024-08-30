import { and, eq } from "drizzle-orm";
import { deleteGrant } from "~/utils/abilities";

export default defineEventHandler(async (event) => {
  await authorize(event, deleteGrant);
  const { id } = getRouterParams(event);

  const deletedGrant = await useDrizzle()
    .delete(tables.grants)
    .where(and(eq(tables.grants.id, Number(id))))
    .returning();

  if (deletedGrant.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Grant not found",
    });
  }

  if (deletedGrant[0].imageUrl) {
    const imageUrl = deletedGrant[0].imageUrl;
    const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    await utapi.deleteFiles(imageKey);
  }

  return deletedGrant;
});
