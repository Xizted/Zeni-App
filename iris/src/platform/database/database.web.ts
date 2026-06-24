import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import { databaseSchema } from './schema';

export function createDatabase(): Database {
  const adapter = new LokiJSAdapter({
    dbName: 'iris',
    schema: databaseSchema,
    useIncrementalIndexedDB: true,
    useWebWorker: false,
  });

  return new Database({ adapter, modelClasses: [] });
}
