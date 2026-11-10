import { create } from 'zustand';
import { Language } from '../i18n';

export type PageId = 
  | 'dashboard' 
  | 'network' 
  | 'account' 
  | 'rings' 
  | 'money' 
  | 'alerts' 
  | 'live' 
  | 'model' 
  | 'fairness' 
  | 'federated' 
  | 'global' 
  | 'howai' 
  | 'reports' 
  | 'demo' 
  | 'safetopay' 
  | 'onboarding' 
  | 'redteam' 
  | 'cashout';

export interface ToastItem {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  timestamp: number;
}

interface UiState {
  activePage: PageId;
  language: Language;
  theme: 'dark' | 'light';
  isDrawerOpen: boolean;
  isCommandPaletteOpen: boolean;
  isCopilotOpen: boolean;
  toasts: ToastItem[];

  // Actions
  setActivePage: (page: PageId) => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  setDrawerOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setCopilotOpen: (open: boolean) => void;
  addToast: (type: ToastItem['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  activePage: 'dashboard',
  language: 'en',
  theme: 'dark',
  isDrawerOpen: false,
  isCommandPaletteOpen: false,
  isCopilotOpen: false,
  toasts: [],

  setActivePage: (page: PageId) => set({ activePage: page }),
  setLanguage: (language: Language) => set({ language }),
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    set({ theme: nextTheme });
  },
  setDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
  setCommandPaletteOpen: (isCommandPaletteOpen: boolean) => set({ isCommandPaletteOpen }),
  setCopilotOpen: (isCopilotOpen: boolean) => set({ isCopilotOpen }),

  addToast: (type, title, message) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, message, timestamp: Date.now() };
    set(state => ({ toasts: [...state.toasts.slice(-4), newToast] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },

  removeToast: (id: string) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  }
}));
