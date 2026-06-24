import { create } from 'zustand';

export type SyncStatus = 'error' | 'idle' | 'offline' | 'syncing';

interface SyncState {
  errorMessage: string | null;
  lastSyncedAt: number | null;
  pendingChanges: number;
  status: SyncStatus;
  markError: (message: string) => void;
  markOffline: () => void;
  markSynced: (timestamp?: number) => void;
  markSyncing: () => void;
  setPendingChanges: (count: number) => void;
}

export const useSyncStore = create<SyncState>()((set) => ({
  errorMessage: null,
  lastSyncedAt: null,
  pendingChanges: 0,
  status: 'idle',
  markError: (errorMessage) => set({ errorMessage, status: 'error' }),
  markOffline: () => set({ status: 'offline' }),
  markSynced: (lastSyncedAt = Date.now()) =>
    set({ errorMessage: null, lastSyncedAt, status: 'idle' }),
  markSyncing: () => set({ errorMessage: null, status: 'syncing' }),
  setPendingChanges: (pendingChanges) => set({ pendingChanges: Math.max(0, pendingChanges) }),
}));
