// store/telegram.ts

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

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