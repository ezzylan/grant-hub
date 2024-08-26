import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { userLogInFormSchema } from "~/utils/schema";

export default defineEventHandler(async (event) => {
  try {
    const result = await readValidatedBody(event, (body) =>
      userLogInFormSchema.safeParse(body),
    );

    if (!result.success) {
      return { error: "Invalid request data" };
    }

    const { email, password } = result.data;

    const users = await useDrizzle()
      .select()
      .from(tables.users)
      .where(eq(tables.users.email, email));

    const user = users[0];

    // For security reasons, do not specify if username or password is incorrect
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error(`Invalid email or password for user: ${email}`);

      return createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    } else {
      await setUserSession(event, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        loggedInAt: new Date(),
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error handling login request:", error);

    return createError({
      statusCode: 500,
      statusMessage: "Failed to process request",
    });
  }
});
