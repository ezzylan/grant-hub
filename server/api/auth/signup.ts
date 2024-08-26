import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { userSignUpFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  try {
    const result = await readValidatedBody(event, (body) =>
      userSignUpFormSchema.safeParse(body),
    );

    if (!result.success) {
      return { error: "Invalid request data" };
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const dbExpertiseArea = await useDrizzle()
      .select({ expertiseArea: tables.users.expertiseArea })
      .from(tables.users)
      .where(eq(tables.users.expertiseArea, result.data.expertiseArea));

    const dbInterestArea = await useDrizzle()
      .select({ interestArea: tables.users.interestArea })
      .from(tables.users)
      .where(eq(tables.users.interestArea, result.data.interestArea));

    try {
      const users = await useDrizzle()
        .insert(tables.users)
        .values({
          name: result.data.name,
          email: result.data.email,
          password: hashedPassword,
          contactNo: result.data.contactNo,
          role: result.data.role,
          organization: result.data.organization,
          position: result.data.position,
          qualification:
            result.data.qualification === "Others"
              ? result.data.otherQualification!
              : result.data.qualification,
          expertiseArea:
            dbExpertiseArea.length > 0
              ? dbExpertiseArea[0].expertiseArea
              : result.data.expertiseArea,
          interestArea:
            dbInterestArea.length > 0
              ? dbInterestArea[0].interestArea
              : result.data.interestArea,
        })
        .returning();

      const user = users[0];

      await setUserSession(event, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
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
