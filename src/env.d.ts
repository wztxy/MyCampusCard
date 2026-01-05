/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ElectronAPI {
  saveImage: (dataUrl: string, defaultName: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  saveJSON: (data: unknown, defaultName: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;

  ssoLogin: (
    stuNo: string,
    password: string
  ) => Promise<{ success: boolean; name?: string; sessionId?: string; error?: string }>;

  fetchCardData: (
    minDate: string,
    maxDate: string,
    stuNo: string,
    sessionId: string
  ) => Promise<{ success: boolean; data?: unknown[]; error?: string }>;

  fetchUserInfo: (sessionId: string) => Promise<{ success: boolean; name?: string; error?: string } | any>;

  onLogMessage: (callback: (message: string) => void) => void;
  onLanguageChange: (callback: (lang: string) => void) => void;

  openExternal: (url: string) => Promise<void>;
  isElectron: boolean;
  platform: string;
}

interface Window {
  electronAPI?: ElectronAPI;
}
