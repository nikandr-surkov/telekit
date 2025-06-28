// components/demos/HapticsDemo.tsx
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

            <DemoSection title="🎯 Selection Haptics">
                <button
                    onClick={() => webApp?.HapticFeedback.selectionChanged()}
                    className="btn-primary w-full"
                >
                    Selection Changed
                </button>

                <CodeBlock language="typescript">
                    {`// Selection feedback
// Use when user selects items in a list
items.forEach((item, index) => {
  item.addEventListener('click', () => {
    webApp.HapticFeedback.selectionChanged()
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
                            Selection changed when moving pieces
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold">Action Game</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Heavy impact for explosions, error for game over
                        </p>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}