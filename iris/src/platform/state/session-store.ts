import { create } from 'zustand';

export interface SessionUser {
  email: string;
  id: string;
  name: string;
}

export type SessionStatus = 'anonymous' | 'authenticated' | 'restoring';

interface SessionState {
  status: SessionStatus;
  user: SessionUser | null;
  clearSession: () => void;
  restoreSession: () => void;
  setSession: (user: SessionUser) => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  status: 'restoring',
  user: null,
  clearSession: () => set({ status: 'anonymous', user: null }),
  restoreSession: () => set({ status: 'restoring', user: null }),
  setSession: (user) => set({ status: 'authenticated', user }),
}));
