import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/core/database/schema/index.ts',
  out: './src/core/database/migrations/generated',
  dbCredentials: {
    url: 'file:personal-manager.db',
  },
  strict: true,
  verbose: true,
});
