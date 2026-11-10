export interface MigrationConfig {
  journal: {
    version: string;
    dialect: string;
    entries: {
      idx: number;
      version: string;
      when: number;
      tag: string;
      breakpoints: boolean;
    }[];
  };
  migrations: Record<string, string>;
}

export const migrations: MigrationConfig = {
  journal: {
    version: '7',
    dialect: 'sqlite',
    entries: [
      {
        idx: 0,
        version: '6',
        when: 1794321624612,
        tag: '0000_volatile_green_goblin',
        breakpoints: true,
      },
    ],
  },
  migrations: {
    m0000:
      "CREATE TABLE `tasks` (\n\t`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,\n\t`title` text NOT NULL,\n\t`description` text DEFAULT '' NOT NULL,\n\t`status` text DEFAULT 'todo' NOT NULL,\n\t`created_at` integer NOT NULL,\n\t`updated_at` integer NOT NULL,\n\tCONSTRAINT \"tasks_status_check\" CHECK(\"tasks\".\"status\" IN ('todo', 'in_progress', 'completed'))\n);\n--> statement-breakpoint\nCREATE INDEX `tasks_status_updated_at_idx` ON `tasks` (`status`,`updated_at`);--> statement-breakpoint\nCREATE TABLE `schema_migrations` (\n\t`version` integer PRIMARY KEY NOT NULL,\n\t`applied_at` integer NOT NULL,\n\t`checksum` text NOT NULL\n);\n",
  },
};

export const migrationChecksums: Readonly<Record<number, string>> = {
  1: '741f3b65a8ed645a83dedfef2f3b69eef60d608667249041639a4cdb122c8cbd',
};
