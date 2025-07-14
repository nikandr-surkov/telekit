// providers/TelegramProvider.tsx

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useTelegramStore } from '@/store/telegram'
import { TelegramWebApp, WebAppUser } from '@/types/telegram'

interface TelegramContextType {
    webApp: TelegramWebApp | null
    user: WebAppUser | null
    isReady: boolean
}

const TelegramContext = createContext<TelegramContextType>({
    webApp: null,
    user: null,
    isReady: false,
})

export function TelegramProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false)
    const [webApp, setWebAppState] = useState<TelegramWebApp | null>(null)
    const [user, setUserState] = useState<WebAppUser | null>(null)
    const { setWebApp, setUser, setTheme } = useTelegramStore()

    useEffect(() => {
        // Only access window in useEffect to ensure it runs on client side
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tgWebApp = window.Telegram.WebApp

            // Initialize WebApp
            tgWebApp.ready()
            tgWebApp.expand()

            // Set theme class
            document.documentElement.className = tgWebApp.colorScheme

            // Store in local state
            setWebAppState(tgWebApp)
            setUserState(tgWebApp.initDataUnsafe.user || null)

            // Store in Zustand
            setWebApp(tgWebApp)
            setUser(tgWebApp.initDataUnsafe.user || null)
            setTheme(tgWebApp.themeParams)

            // Listen to theme changes
            tgWebApp.onEvent('themeChanged', () => {
                document.documentElement.className = tgWebApp.colorScheme
                setTheme(tgWebApp.themeParams)
            })

            setIsReady(true)
        }
    }, [setWebApp, setUser, setTheme])

    const value = {
        webApp,
        user,
        isReady,
    }

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    )
}

export const useTelegram = () => {
    const context = useContext(TelegramContext)
    if (!context) {
        throw new Error('useTelegram must be used within TelegramProvider')
    }
    return context
}