import { eq } from "drizzle-orm";
import { editUser } from "~/utils/abilities";
import { editUserFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, editUser);
  const { id } = getRouterParams(event);

  const result = await readValidatedBody(event, (body) =>
    editUserFormSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  return await useDrizzle()
    .update(tables.users)
    .set({
      name: result.data.name,
      email: result.data.email,
      contactNo: result.data.contactNo,
      role: result.data.role,
      organization: result.data.organization,
      position: result.data.position,
      qualification:
        result.data.qualification === "Others"
          ? result.data.otherQualification
          : result.data.qualification,
      expertiseArea: result.data.expertiseArea,
      interestArea: result.data.interestArea,
    })
    .where(eq(tables.users.id, Number(id)));
});
