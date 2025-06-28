// utils/telegram.ts
export function validateInitData(initData: string, botToken: string): boolean {
    // This should be done on your backend
    // Example implementation for reference only
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    urlParams.delete('hash')

    // Sort parameters
    const params = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

    // In production, verify hash on backend with bot token
    return true // Placeholder
}

export function formatTelegramDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString()
}

export function isDesktop(platform: string): boolean {
    return ['macos', 'windows', 'linux'].includes(platform.toLowerCase())
}

export function isMobile(platform: string): boolean {
    return ['ios', 'android'].includes(platform.toLowerCase())
}