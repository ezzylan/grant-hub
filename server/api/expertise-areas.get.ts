export default defineEventHandler(async () => {
  const result = await useDrizzle()
    .select({ expertiseArea: tables.users.expertiseArea })
    .from(tables.users);

  return Array.from(new Set(result.map((r) => r.expertiseArea))).sort((a, b) =>
    a.localeCompare(b),
  );
});
