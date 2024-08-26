DROP TABLE `collaborators`;--> statement-breakpoint
ALTER TABLE `grants` ADD `deadline` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `interest_area` text NOT NULL;