// hooks/useHaptic.ts
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