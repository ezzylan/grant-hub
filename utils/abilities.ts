import type { User } from "#auth-utils";
import type { SelectGrant } from "~/server/utils/drizzle";

export const addGrant = defineAbility(() => true);

export const editGrant = defineAbility((user: User, grant: SelectGrant) => {
  return user.id === grant.creatorId;
});

export const deleteGrant = defineAbility(
  (user: User, grant: SelectGrant) => user.id === grant.creatorId,
);

export const showUserGrants = defineAbility(
  (user: User, targetUser: User) => user.id === targetUser.id,
);

export const editUser = defineAbility(
  (user: User, targetUser: User) => user.id === targetUser.id,
);

export const deleteUser = defineAbility(
  (user: User, targetUser: User) => user.id === targetUser.id,
);
