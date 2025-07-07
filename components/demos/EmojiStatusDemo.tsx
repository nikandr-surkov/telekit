// components/demos/EmojiStatusDemo.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function EmojiStatusDemo() {
    const { webApp, user } = useTelegram()
    const [emojiId, setEmojiId] = useState('5000569394542078246')
    const [duration, setDuration] = useState(300)
    const [hasAccess, setHasAccess] = useState<boolean | null>(null)
    const [lastSetEmoji, setLastSetEmoji] = useState<string | null>(null)
    const [lastSetTime, setLastSetTime] = useState<Date | null>(null)
    const [lastSetDuration, setLastSetDuration] = useState<number>(300)

    // Fun emoji IDs for quick selection
    // These are actual custom emoji IDs from Telegram's emoji packs
    const popularEmojis = [
        { id: '5213305508034783384', name: '🗿 Moai', preview: '🗿' },
        { id: '5323753070247552140', name: '👻 Ghost', preview: '👻' },
        { id: '5449505950283078474', name: '❤️ Red Heart', preview: '❤️' }
    ]

    // Load saved state from localStorage
    useEffect(() => {
        const savedEmoji = localStorage.getItem('lastSetEmoji')
        const savedTime = localStorage.getItem('lastSetEmojiTime')
        const savedDuration = localStorage.getItem('lastSetEmojiDuration')
        const savedAccess = localStorage.getItem('emojiStatusAccess')

        if (savedEmoji) setLastSetEmoji(savedEmoji)
        if (savedTime) setLastSetTime(new Date(savedTime))
        if (savedDuration) setLastSetDuration(parseInt(savedDuration))
        if (savedAccess) setHasAccess(savedAccess === 'true')
    }, [])

    const setEmojiStatus = () => {
        if (!webApp?.isVersionAtLeast('7.7')) {
            webApp?.showAlert('Emoji status requires Telegram version 7.7 or higher')
            return
        }

        console.log('Setting emoji status:', emojiId, 'duration:', duration)

        webApp?.setEmojiStatus(
            emojiId,
            duration > 0 ? { duration } : { duration: 0 }, // Explicitly set duration:0 for permanent
            (set: boolean) => {
                console.log('Emoji status set result:', set)
                webApp.HapticFeedback.notificationOccurred(set ? 'success' : 'error')

                if (set) {
                    setLastSetEmoji(emojiId)
                    setLastSetTime(new Date())
                    setLastSetDuration(duration)

                    // Save to localStorage
                    localStorage.setItem('lastSetEmoji', emojiId)
                    localStorage.setItem('lastSetEmojiTime', new Date().toISOString())
                    localStorage.setItem('lastSetEmojiDuration', duration.toString())

                    const selectedEmoji = popularEmojis.find(e => e.id === emojiId)
                    const emojiName = selectedEmoji ? selectedEmoji.name : 'Custom emoji'
                    webApp.showAlert(`${emojiName} status set! It will appear next to your name in chats.`)
                } else {
                    webApp.showAlert('Failed to set status. Make sure you have granted access.')
                }
            }
        )
    }

    const requestAccess = () => {
        console.log('Requesting emoji status access...')
        webApp?.requestEmojiStatusAccess((allowed: boolean) => {
            console.log('Emoji status access result:', allowed)
            setHasAccess(allowed)
            localStorage.setItem('emojiStatusAccess', allowed.toString())
            webApp.showAlert(`Emoji status access ${allowed ? 'granted' : 'denied'}`)

            if (allowed) {
                webApp.HapticFeedback.notificationOccurred('success')
            }
        })
    }

    const formatDuration = (seconds: number) => {
        if (seconds === 0) return 'Permanent'
        if (seconds < 60) return `${seconds} seconds`
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`
        return `${Math.floor(seconds / 86400)} days`
    }

    const getTimeRemaining = () => {
        if (!lastSetTime) return null
        if (lastSetDuration === 0) return 'Permanent status'

        const elapsed = (new Date().getTime() - lastSetTime.getTime()) / 1000
        const remaining = lastSetDuration - elapsed

        if (remaining <= 0) return 'Expired'
        return `Expires in ${formatDuration(Math.floor(remaining))}`
    }

    // Check version support
    const supportsEmojiStatus = webApp?.isVersionAtLeast('7.7') ?? false

    return (
        <div className="space-y-6">
            <DemoSection title="😊 Emoji Status">
                <div className="space-y-4">
                    {/* Version check */}
                    {webApp && !supportsEmojiStatus && (
                        <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                ⚠️ Emoji status requires Telegram version 7.7 or higher.
                                Your version: {webApp.version}
                            </p>
                        </div>
                    )}

                    {/* User info and current status */}
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <h4 className="font-semibold mb-2">User Info</h4>
                        <div className="space-y-1 text-sm">
                            <p>Name: {user?.first_name} {user?.last_name || ''}</p>
                            <p>Premium: {user?.is_premium ? '✅ Yes' : '❌ No'}</p>
                            <p>Access Granted: {hasAccess === null ? '❓ Unknown' : hasAccess ? '✅ Yes' : '❌ No'}</p>
                        </div>

                        {lastSetEmoji && (
                            <div className="mt-3 pt-3 border-t border-[var(--tg-theme-hint-color)]/20">
                                <p className="text-sm font-semibold">Last Set Status:</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl">
                                        {popularEmojis.find(e => e.id === lastSetEmoji)?.preview || '❓'}
                                    </span>
                                    <div>
                                        <p className="text-sm">
                                            {popularEmojis.find(e => e.id === lastSetEmoji)?.name || 'Custom Emoji'}
                                        </p>
                                        <p className="text-xs text-[var(--tg-theme-hint-color)]">
                                            {getTimeRemaining()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Popular emojis - now in a grid */}
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <h4 className="font-semibold mb-3">Fun Status Emojis</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {popularEmojis.map((emoji) => (
                                <button
                                    key={emoji.id}
                                    onClick={() => setEmojiId(emoji.id)}
                                    className={`p-3 rounded border transition-all ${emojiId === emoji.id
                                            ? 'border-[var(--tg-theme-button-color)] bg-[var(--tg-theme-button-color)]/10 scale-105'
                                            : 'border-[var(--tg-theme-hint-color)]/30 hover:border-[var(--tg-theme-hint-color)]/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{emoji.preview}</div>
                                    <div className="text-xs">{emoji.name.split(' ')[1]}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom emoji input */}
                    <div>
                        <label className="text-sm text-[var(--tg-theme-hint-color)]">Custom Emoji ID</label>
                        <input
                            type="text"
                            value={emojiId}
                            onChange={(e) => setEmojiId(e.target.value)}
                            placeholder="Enter custom emoji ID"
                            className="w-full p-3 mt-1 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]"
                        />
                        <p className="text-xs text-[var(--tg-theme-hint-color)] mt-1">
                            Current: {popularEmojis.find(e => e.id === emojiId)?.name || 'Custom ID'}
                        </p>
                    </div>

                    {/* Duration selector */}
                    <div>
                        <label className="text-sm text-[var(--tg-theme-hint-color)]">
                            Duration: {formatDuration(duration)}
                        </label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            <button
                                onClick={() => setDuration(300)}
                                className={`btn-secondary text-sm ${duration === 300 ? 'ring-2 ring-[var(--tg-theme-button-color)]' : ''}`}
                            >
                                5 min
                            </button>
                            <button
                                onClick={() => setDuration(3600)}
                                className={`btn-secondary text-sm ${duration === 3600 ? 'ring-2 ring-[var(--tg-theme-button-color)]' : ''}`}
                            >
                                1 hour
                            </button>
                            <button
                                onClick={() => setDuration(86400)}
                                className={`btn-secondary text-sm ${duration === 86400 ? 'ring-2 ring-[var(--tg-theme-button-color)]' : ''}`}
                            >
                                1 day
                            </button>
                            <button
                                onClick={() => setDuration(0)}
                                className={`btn-secondary text-sm ${duration === 0 ? 'ring-2 ring-[var(--tg-theme-button-color)]' : ''}`}
                            >
                                Forever
                            </button>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="604800"
                            step="300"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full mt-3"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                        {hasAccess !== true && (
                            <button
                                onClick={requestAccess}
                                className="btn-primary w-full"
                                disabled={!supportsEmojiStatus}
                            >
                                Request Emoji Status Access
                            </button>
                        )}

                        <button
                            onClick={setEmojiStatus}
                            className="btn-primary w-full"
                            disabled={!supportsEmojiStatus || !emojiId}
                        >
                            Set {popularEmojis.find(e => e.id === emojiId)?.preview || ''} Emoji Status
                        </button>
                    </div>

                    {/* Info box */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            💡 <strong>Note:</strong> Emoji status appears next to your name in chat lists
                            and messages. Premium users see custom emoji animations.
                        </p>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Request emoji status access
webApp.requestEmojiStatusAccess((allowed) => {
  if (allowed) {
    // Can now set emoji status
  }
})

// Set emoji status with duration
webApp.setEmojiStatus(
  'custom_emoji_id',
  { duration: 300 }, // 5 minutes (0 for permanent)
  (success) => {
    console.log('Status set:', success)
  }
)`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="📝 Implementation Notes">
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Finding Custom Emoji IDs</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mt-1">
                            To get custom emoji IDs, you can use the Bot API's getCustomEmojiStickers
                            method or inspect emoji messages in your bot. Each custom emoji pack has
                            unique IDs for animated emojis.
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Premium Features</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mt-1">
                            Premium users can see animated custom emojis. Non-premium users will see
                            a static version or fallback emoji.
                        </p>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}