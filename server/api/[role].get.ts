import { capitalCase } from "change-case";
import { and, desc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const role = getRouterParam(event, "role");
  const capitalRole = capitalCase(String(role));

  const searchRole =
    role === "npo-members"
      ? "Non-Profit Organization Member"
      : role === "professionals"
        ? "Professional/Industry Expert"
        : capitalRole.endsWith("s")
          ? capitalRole.slice(0, -1)
          : capitalRole;

  const { expertiseArea } = getQuery(event);

  if (expertiseArea === `All ${capitalRole}`) {
    return await useDrizzle()
      .select()
      .from(tables.users)
      .where(eq(tables.users.role, searchRole))
      .orderBy(desc(tables.users.id));
  } else {
    return await useDrizzle()
      .select()
      .from(tables.users)
      .where(
        and(
          eq(tables.users.role, searchRole),
          eq(tables.users.expertiseArea, String(expertiseArea)),
        ),
      )
      .orderBy(desc(tables.users.id));
  }
});
