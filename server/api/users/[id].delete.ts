import { and, eq } from "drizzle-orm";
import { deleteUser } from "~/utils/abilities";

export default defineEventHandler(async (event) => {
  await authorize(event, deleteUser);
  const { id } = getRouterParams(event);

  const deletedUser = await useDrizzle()
    .delete(tables.users)
    .where(and(eq(tables.users.id, Number(id))));

  if (!deletedUser) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  return deletedUser;
});
