export type SyncOperationKind = 'create' | 'delete' | 'update';

export interface SyncOperation {
  baseVersion: number | null;
  clientMutationId: string;
  kind: SyncOperationKind;
  payload: Readonly<Record<string, unknown>>;
  recordId: string;
  table: string;
}

export interface PullChangesResult {
  changes: readonly SyncOperation[];
  cursor: string;
}

export interface SyncTransport {
  pull(cursor: string | null, signal?: AbortSignal): Promise<PullChangesResult>;
  push(operations: readonly SyncOperation[], signal?: AbortSignal): Promise<void>;
}

export interface SyncEngine {
  synchronize(signal?: AbortSignal): Promise<void>;
}
