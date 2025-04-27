// src/hooks/usePasskeyStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PasskeyStore {
  display: string | null;
  passkey_id: string | null;
  user_code: string | null;
  challenge: string | null;
  credential_id: string | null;
  label?: string | null;
  reset: () => void;
}

const initialState: Omit<PasskeyStore, 'reset'> = {
  display: null,
  passkey_id: null,
  user_code: null,
  challenge: null,
  credential_id: null,
  label: null,
};

export const usePasskeyStore = create<PasskeyStore>()(
  persist(
    (set) => ({
      ...initialState,
      reset: () => set(initialState),
    }),
    {
      name: 'vergo-passkey-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
