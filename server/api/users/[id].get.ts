import { eq } from "drizzle-orm";
import { SelectGrant } from "~/server/utils/drizzle";
import { showUserGrants } from "~/utils/abilities";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const users = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, Number(id)));

  const { user } = await getUserSession(event);
  let grants: SelectGrant[] = [];
  const fetchedUser = users[0];

  if (await allows(event, showUserGrants, user)) {
    grants = await useDrizzle()
      .select()
      .from(tables.grants)
      .where(eq(tables.grants.creatorId, fetchedUser.id));
  }

  return { fetchedUser, grants };
});
