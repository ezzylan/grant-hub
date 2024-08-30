import { z } from "zod";

export const grantFormSchema = z.object({
  name: z.string().min(2),
  funder: z.string().min(2),
  category: z.enum(["Industry", "Government", "University"]),
  description: z.string().min(1),
  websiteLink: z.string(),
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
  imageUrl: z.string().optional(),
});

export const userSignUpFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
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
  imageUrl: z.string().optional(),
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
