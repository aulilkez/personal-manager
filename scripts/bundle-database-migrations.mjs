import { createHash } from 'node:crypto';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDirectory = path.join(root, 'src/core/database/migrations/generated');
const journal = JSON.parse(
  await readFile(path.join(migrationsDirectory, 'meta/_journal.json'), 'utf8'),
);

const migrationEntries = [];
const checksumEntries = [];

for (const entry of journal.entries) {
  const migrationSql = await readFile(path.join(migrationsDirectory, `${entry.tag}.sql`), 'utf8');
  const migrationKey = `m${String(entry.idx).padStart(4, '0')}`;
  const schemaVersion = entry.idx + 1;
  const checksum = createHash('sha256').update(migrationSql).digest('hex');

  migrationEntries.push(`    ${JSON.stringify(migrationKey)}: ${JSON.stringify(migrationSql)}`);
  checksumEntries.push(`  ${schemaVersion}: ${JSON.stringify(checksum)}`);
}

const generatedModule = `export interface MigrationConfig {
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
  journal: ${JSON.stringify(journal, null, 2).replace(/^/gm, '  ').trimStart()},
  migrations: {
${migrationEntries.join(',\n')}
  },
};

export const migrationChecksums: Readonly<Record<number, string>> = {
${checksumEntries.join(',\n')}
};
`;
const bundlePath = path.join(root, 'src/core/database/migrations/migrations.ts');
const prettierOptions = await resolveConfig(bundlePath);

await writeFile(
  bundlePath,
  await format(generatedModule, {
    ...prettierOptions,
    parser: 'typescript',
  }),
);
await rm(path.join(migrationsDirectory, 'migrations.js'), { force: true });
