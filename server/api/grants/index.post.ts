import { addGrant } from "~/utils/abilities";
import { grantFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, addGrant);
  const result = await readValidatedBody(event, (body) =>
    grantFormSchema.parse(body),
  );

  const { user } = await getUserSession(event);

  return await useDrizzle().insert(tables.grants).values({
    name: result.name,
    funder: result.funder,
    category: result.category,
    description: result.description,
    websiteLink: result.websiteLink,
    ceiling: result.ceiling,
    expectedGrantCall: result.expectedGrantCall,
    deadline: result.deadline,
    availability: result.availability,
    creatorId: user!.id,
    imageUrl: result.imageUrl,
  });
});
