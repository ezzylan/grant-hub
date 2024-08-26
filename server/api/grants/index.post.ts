import { addGrant } from "~/utils/abilities";
import { grantFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, addGrant);
  const result = await readValidatedBody(event, (body) =>
    grantFormSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const { user } = await getUserSession(event);

  return await useDrizzle().insert(tables.grants).values({
    name: result.data.name,
    funder: result.data.funder,
    category: result.data.category,
    description: result.data.description,
    websiteLink: result.data.websiteLink,
    ceiling: result.data.ceiling,
    expectedGrantCall: result.data.expectedGrantCall,
    deadline: result.data.deadline,
    availability: result.data.availability,
    creatorId: user?.id,
  });
});
