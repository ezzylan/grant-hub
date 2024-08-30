import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const grants = sqliteTable("grants", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  funder: text("funder").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  websiteLink: text("website_link").notNull(),
  ceiling: integer("ceiling").notNull(),
  expectedGrantCall: text("expected_grant_call").notNull(),
  deadline: text("deadline").notNull(),
  availability: text("availability").notNull(),
  imageUrl: text("image_url"),
  creatorId: integer("creator_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  contactNo: text("contact_no").notNull(),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  position: text("position").notNull(),
  qualification: text("qualification").notNull(),
  expertiseArea: text("expertise_area").notNull(),
  interestArea: text("interest_area").notNull(),
  imageUrl: text("image_url"),
});
