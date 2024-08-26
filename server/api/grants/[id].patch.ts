import { eq } from "drizzle-orm";
import { editGrant } from "~/utils/abilities";
import { grantFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, editGrant);
  const { id } = getRouterParams(event);

  const result = await readValidatedBody(event, (body) =>
    grantFormSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  return await useDrizzle()
    .update(tables.grants)
    .set({
      name: result.data.name,
      funder: result.data.funder,
      category: result.data.category,
      description: result.data.description,
      websiteLink: result.data.websiteLink,
      ceiling: result.data.ceiling,
      expectedGrantCall: result.data.expectedGrantCall,
      deadline: result.data.deadline,
      availability: result.data.availability,
    })
    .where(eq(tables.grants.id, Number(id)));
});
