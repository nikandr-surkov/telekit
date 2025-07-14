// components/demos/HapticsDemo.tsx

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

'use client'

import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function HapticsDemo() {
    const { webApp } = useTelegram()

    const impactStyles = ['light', 'medium', 'heavy', 'rigid', 'soft'] as const
    const notificationTypes = ['error', 'success', 'warning'] as const

    return (
        <div className="space-y-6">
            <DemoSection title="💥 Impact Haptics">
                <div className="grid grid-cols-2 gap-2">
                    {impactStyles.map(style => (
                        <button
                            key={style}
                            onClick={() => webApp?.HapticFeedback.impactOccurred(style)}
                            className="btn-primary capitalize"
                        >
                            {style}
                        </button>
                    ))}
                </div>

                <CodeBlock language="typescript">
                    {`// Impact haptics for game events
webApp.HapticFeedback.impactOccurred('light')   // Tap
webApp.HapticFeedback.impactOccurred('medium')  // Button press
webApp.HapticFeedback.impactOccurred('heavy')   // Collision
webApp.HapticFeedback.impactOccurred('rigid')   // Hard stop
webApp.HapticFeedback.impactOccurred('soft')    // Soft bounce`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🔔 Notification Haptics">
                <div className="grid grid-cols-3 gap-2">
                    {notificationTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => webApp?.HapticFeedback.notificationOccurred(type)}
                            className={`btn-primary capitalize ${type === 'error' ? 'bg-red-500' :
                                type === 'success' ? 'bg-green-500' :
                                    'bg-yellow-500'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <CodeBlock language="typescript">
                    {`// Notification haptics
webApp.HapticFeedback.notificationOccurred('success') // Level complete
webApp.HapticFeedback.notificationOccurred('error')   // Game over
webApp.HapticFeedback.notificationOccurred('warning') // Low health`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🎯 Haptic Patterns">
                <div className="space-y-3">
                    <p className="text-sm text-[var(--tg-theme-hint-color)]">
                        For selection feedback, use light impact:
                    </p>

                    <button
                        onClick={() => webApp?.HapticFeedback.impactOccurred('light')}
                        className="btn-primary w-full"
                    >
                        Selection Feedback (Light Impact)
                    </button>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <p className="text-sm font-semibold mb-2">Common Patterns:</p>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    // Double tap pattern
                                    webApp?.HapticFeedback.impactOccurred('light')
                                    setTimeout(() => webApp?.HapticFeedback.impactOccurred('light'), 100)
                                }}
                                className="btn-secondary w-full text-sm"
                            >
                                Double Tap Pattern
                            </button>

                            <button
                                onClick={() => {
                                    // Success pattern
                                    webApp?.HapticFeedback.impactOccurred('medium')
                                    setTimeout(() => webApp?.HapticFeedback.notificationOccurred('success'), 200)
                                }}
                                className="btn-secondary w-full text-sm"
                            >
                                Success Action Pattern
                            </button>

                            <button
                                onClick={() => {
                                    // Error pattern
                                    webApp?.HapticFeedback.impactOccurred('heavy')
                                    setTimeout(() => webApp?.HapticFeedback.notificationOccurred('error'), 150)
                                }}
                                className="btn-secondary w-full text-sm"
                            >
                                Error Action Pattern
                            </button>
                        </div>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Telegram WebApp only supports these haptic methods:

// 1. Impact haptics (5 styles)
webApp.HapticFeedback.impactOccurred('light')
webApp.HapticFeedback.impactOccurred('medium')
webApp.HapticFeedback.impactOccurred('heavy')
webApp.HapticFeedback.impactOccurred('rigid')
webApp.HapticFeedback.impactOccurred('soft')

// 2. Notification haptics (3 types)
webApp.HapticFeedback.notificationOccurred('error')
webApp.HapticFeedback.notificationOccurred('success')
webApp.HapticFeedback.notificationOccurred('warning')

// For selection feedback, use light impact:
items.forEach((item, index) => {
  item.addEventListener('click', () => {
    webApp.HapticFeedback.impactOccurred('light')
    selectItem(index)
  })
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🎮 Game Examples">
                <div className="space-y-4 p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                    <div>
                        <h4 className="font-semibold">Clicker Game</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Light impact on each tap
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold">Puzzle Game</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Light impact when selecting/moving pieces
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold">Action Game</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Heavy impact for explosions, error notification for game over
                        </p>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}