// store/telegram.ts
import { TelegramWebApp, ThemeParams, WebAppUser } from '@/types/telegram'
import { create } from 'zustand'

interface TelegramStore {
    webApp: TelegramWebApp | null
    user: WebAppUser | null
    theme: ThemeParams | null
    setWebApp: (webApp: TelegramWebApp) => void
    setUser: (user: WebAppUser | null) => void
    setTheme: (theme: ThemeParams) => void
}

export const useTelegramStore = create<TelegramStore>((set) => ({
    webApp: null,
    user: null,
    theme: null,
    setWebApp: (webApp) => set({ webApp }),
    setUser: (user) => set({ user }),
    setTheme: (theme) => set({ theme }),
}))