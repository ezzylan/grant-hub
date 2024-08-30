import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { userSignUpFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  try {
    const result = await readValidatedBody(event, (body) =>
      userSignUpFormSchema.parse(body),
    );

    const hashedPassword = await bcrypt.hash(result.password, 10);

    const dbExpertiseArea = await useDrizzle()
      .select({ expertiseArea: tables.users.expertiseArea })
      .from(tables.users)
      .where(eq(tables.users.expertiseArea, result.expertiseArea));

    const dbInterestArea = await useDrizzle()
      .select({ interestArea: tables.users.interestArea })
      .from(tables.users)
      .where(eq(tables.users.interestArea, result.interestArea));

    try {
      const users = await useDrizzle()
        .insert(tables.users)
        .values({
          name: result.name,
          email: result.email,
          password: hashedPassword,
          contactNo: result.contactNo,
          role: result.role,
          organization: result.organization,
          position: result.position,
          qualification:
            result.qualification === "Others"
              ? result.otherQualification!
              : result.qualification,
          expertiseArea:
            dbExpertiseArea.length > 0
              ? dbExpertiseArea[0].expertiseArea
              : result.expertiseArea,
          interestArea:
            dbInterestArea.length > 0
              ? dbInterestArea[0].interestArea
              : result.interestArea,
          imageUrl: result.imageUrl,
        })
        .returning();

      const user = users[0];

      await setUserSession(event, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
        },
        loggedInAt: new Date(),
      });

      return { success: true, user };
    } catch (error) {
      console.error("Error creating user:", error);

      return createError({
        statusCode: 409,
        statusMessage: "Email already exists",
      });
    }
  } catch (error) {
    console.error("Error handling signup request:", error);

    return createError({
      statusCode: 400,
      statusMessage: "Failed to process request",
    });
  }
});
