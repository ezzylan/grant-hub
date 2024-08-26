CREATE TABLE `collaborators` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`website_link` text NOT NULL,
	`creator_id` integer,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `grants` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`funder` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`website_link` text NOT NULL,
	`ceiling` integer NOT NULL,
	`expected_grant_call` text NOT NULL,
	`availability` text DEFAULT 'Available' NOT NULL,
	`creator_id` integer,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`contact_no` text NOT NULL,
	`position` text NOT NULL,
	`organization` text NOT NULL,
	`qualification` text NOT NULL,
	`expertise_area` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);