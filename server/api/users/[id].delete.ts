import { and, eq } from "drizzle-orm";
import { deleteUser } from "~/utils/abilities";

export default defineEventHandler(async (event) => {
  await authorize(event, deleteUser);
  const { id } = getRouterParams(event);

  const deletedUser = await useDrizzle()
    .delete(tables.users)
    .where(and(eq(tables.users.id, Number(id))))
    .returning();

  if (deletedUser.length === 0) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  if (deletedUser[0].imageUrl) {
    const imageUrl = deletedUser[0].imageUrl;
    const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    await utapi.deleteFiles(imageKey);
  }

  return deletedUser;
});
