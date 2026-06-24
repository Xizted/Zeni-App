import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { databaseSchema } from './schema';

export function createDatabase(): Database {
  const adapter = new SQLiteAdapter({
    dbName: 'iris',
    jsi: true,
    onSetUpError: (error) => {
      console.error('Unable to initialize Iris database.', error);
    },
    schema: databaseSchema,
  });

  return new Database({ adapter, modelClasses: [] });
}
