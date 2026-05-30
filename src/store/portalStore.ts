import { create } from 'zustand';

export type Portal = 'main' | 'mini';

interface PortalState {
  activePortal: Portal | null;
  setPortal: (portal: Portal) => void;
  clearPortal: () => void;
}

export const usePortalStore = create<PortalState>((set) => ({
  activePortal: (localStorage.getItem('activePortal') as Portal) || null,
  setPortal: (portal) => {
    localStorage.setItem('activePortal', portal);
    set({ activePortal: portal });
  },
  clearPortal: () => {
    localStorage.removeItem('activePortal');
    set({ activePortal: null });
  }
}));
