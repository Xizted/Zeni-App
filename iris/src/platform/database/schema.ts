import { appSchema } from '@nozbe/watermelondb';

// Feature schemas and migrations are added together with their first real model.
export const databaseSchema = appSchema({
  version: 1,
  tables: [],
});
