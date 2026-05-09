import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        set({ token, user: JSON.parse(user) });
      }
    }
  },
}));

export const useScanStore = create((set) => ({
  scans: [],
  currentScan: null,
  isLoading: false,
  
  setScans: (scans) => set({ scans }),
  setCurrentScan: (scan) => set({ currentScan: scan }),
  setLoading: (isLoading) => set({ isLoading }),
  
  addScan: (scan) => set((state) => ({
    scans: [scan, ...state.scans],
  })),
  
  updateScan: (scanId, updates) => set((state) => ({
    scans: state.scans.map((s) => 
      s.id === scanId ? { ...s, ...updates } : s
    ),
    currentScan: state.currentScan?.id === scanId 
      ? { ...state.currentScan, ...updates }
      : state.currentScan,
  })),
}));
