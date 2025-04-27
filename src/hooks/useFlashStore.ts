// src/hooks/useFlashStore.ts
import { create } from 'zustand';
import { AlertColor } from '@mui/material';

export interface FlashQueueItem {
  id: number;
  msg: string;
  severity: AlertColor;
  timeout?: NodeJS.Timeout;
}

export interface FlashStore {
  queue: FlashQueueItem[];
  open: (msg: string, severity?: AlertColor) => void;
  close: (id: number) => void;
}

let idCounter = 0;

export const useFlashStore = create<FlashStore>((set, get) => ({
  queue: [],
  open: (msg, severity = 'info') => {
    const id = ++idCounter;
    const timeout = setTimeout(() => get().close(id), 6000);
    set(state => ({
      queue: [...state.queue, { id, msg, severity, timeout }],
    }));
  },
  close: (id) => {
    const { queue } = get();
    const item = queue.find(i => i.id === id);
    if (item?.timeout) clearTimeout(item.timeout);
    set({ queue: queue.filter(i => i.id !== id) });
  },
}));
