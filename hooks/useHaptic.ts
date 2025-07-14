// hooks/useHaptic.ts

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

import { useTelegram } from '@/providers/TelegramProvider'

export function useHaptic() {
    const { webApp } = useTelegram()

    const impact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
        webApp?.HapticFeedback.impactOccurred(style)
    }

    const notification = (type: 'error' | 'success' | 'warning') => {
        webApp?.HapticFeedback.notificationOccurred(type)
    }

    const selection = () => {
        webApp?.HapticFeedback.selectionChanged()
    }

    return { impact, notification, selection }
}