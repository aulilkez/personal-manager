CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'todo' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "tasks_status_check" CHECK("tasks"."status" IN ('todo', 'in_progress', 'completed'))
);
--> statement-breakpoint
CREATE INDEX `tasks_status_updated_at_idx` ON `tasks` (`status`,`updated_at`);--> statement-breakpoint
CREATE TABLE `schema_migrations` (
	`version` integer PRIMARY KEY NOT NULL,
	`applied_at` integer NOT NULL,
	`checksum` text NOT NULL
);
