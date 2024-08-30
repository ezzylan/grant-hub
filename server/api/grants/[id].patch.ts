import { eq } from "drizzle-orm";
import { editGrant } from "~/utils/abilities";
import { grantFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, editGrant);
  const { id } = getRouterParams(event);

  const result = await readValidatedBody(event, (body) =>
    grantFormSchema.parse(body),
  );

  return await useDrizzle()
    .update(tables.grants)
    .set({
      name: result.name,
      funder: result.funder,
      category: result.category,
      description: result.description,
      websiteLink: result.websiteLink,
      ceiling: result.ceiling,
      expectedGrantCall: result.expectedGrantCall,
      deadline: result.deadline,
      availability: result.availability,
      imageUrl: result.imageUrl,
    })
    .where(eq(tables.grants.id, Number(id)));
});
