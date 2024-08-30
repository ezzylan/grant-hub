import { eq } from "drizzle-orm";
import { editUser } from "~/utils/abilities";
import { editUserFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, editUser);
  const { id } = getRouterParams(event);

  const result = await readValidatedBody(event, (body) =>
    editUserFormSchema.parse(body),
  );

  const fetchedUser = await useDrizzle()
    .select({ imageUrl: tables.users.imageUrl })
    .from(tables.users)
    .where(eq(tables.users.id, Number(id)));

  if (fetchedUser[0].imageUrl) {
    const imageUrl =
      result.imageUrl !== fetchedUser[0].imageUrl
        ? fetchedUser[0].imageUrl
        : result.imageUrl;
    const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    await utapi.deleteFiles(imageKey);
  }

  const session = await getUserSession(event);

  await setUserSession(event, {
    user: {
      id: session.user!.id,
      name:
        result.name !== session.user!.name ? result.name : session.user!.name,
      email:
        result.email !== session.user!.email
          ? result.email
          : session.user!.email,
      imageUrl:
        result.imageUrl !== session.user!.imageUrl
          ? result.imageUrl
          : session.user!.imageUrl,
    },
    loggedInAt: new Date(),
  });

  return await useDrizzle()
    .update(tables.users)
    .set({
      name: result.name,
      email: result.email,
      contactNo: result.contactNo,
      role: result.role,
      organization: result.organization,
      position: result.position,
      qualification:
        result.qualification === "Others"
          ? result.otherQualification
          : result.qualification,
      expertiseArea: result.expertiseArea,
      interestArea: result.interestArea,
      imageUrl:
        result.imageUrl !== fetchedUser[0].imageUrl
          ? result.imageUrl
          : fetchedUser[0].imageUrl,
    })
    .where(eq(tables.users.id, Number(id)));
});
