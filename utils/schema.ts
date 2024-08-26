import { z } from "zod";

export const grantFormSchema = z.object({
  name: z.string().min(2),
  funder: z.string().min(2),
  category: z.enum(["Industry", "Government", "University"]),
  description: z.string().min(1),
  websiteLink: z.string().url(),
  ceiling: z.coerce.number().positive().int().multipleOf(10000),
  expectedGrantCall: z.string().min(2),
  deadline: z.string().min(2),
  availability: z.enum([
    "Pre-Announcement",
    "Open for Application",
    "Rolling Application",
    "Deadline Approaching",
    "Closed for Application",
    "Under Review",
    "Award Decision Pending",
    "Awarded",
    "Reopened",
    "Grant Closed",
  ]),
});

export const userSignUpFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be 8 or more characters long" }),
  contactNo: z.string().min(10),
  role: z.enum([
    "Academician",
    "Professional/Industry Expert",
    "Community Member",
    "Non-Profit Organization Member",
    "Other",
  ]),
  organization: z.string().min(2),
  position: z.string().min(2),
  qualification: z.enum(["Bac Degree", "Master", "PhD", "Others"]),
  otherQualification: z.string().min(3).optional(),
  expertiseArea: z.string().min(2),
  interestArea: z.string().min(2),
});

export const userLogInFormSchema = userSignUpFormSchema.pick({
  email: true,
  password: true,
});

export const editUserFormSchema = userSignUpFormSchema.omit({ password: true });

export type GrantFormSchema = z.infer<typeof grantFormSchema>;
export type UserSignUpFormSchema = z.infer<typeof userSignUpFormSchema>;
export type UserLogInFormSchema = z.infer<typeof userLogInFormSchema>;
export type EditUserFormSchema = z.infer<typeof editUserFormSchema>;
