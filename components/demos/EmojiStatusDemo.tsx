// components/demos/EmojiStatusDemo.tsx
'use client'

import { useState } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function EmojiStatusDemo() {
    const { webApp } = useTelegram()
    const [emojiId, setEmojiId] = useState('5213305508034783384')
    const [duration, setDuration] = useState(300)

    const setEmojiStatus = () => {
        webApp?.setEmojiStatus(
            emojiId,
            duration ? { duration } : {},
            (set: boolean) => {
                webApp.HapticFeedback.notificationOccurred(set ? 'success' : 'error')
                webApp.showAlert(set ? 'Emoji status set!' : 'Failed to set status')
            }
        )
    }

    const requestAccess = () => {
        webApp?.requestEmojiStatusAccess((allowed: boolean) => {
            webApp.showAlert(`Emoji status access ${allowed ? 'granted' : 'denied'}`)
        })
    }

    return (
        <div className="space-y-6">
            <DemoSection title="😊 Emoji Status">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={emojiId}
                        onChange={(e) => setEmojiId(e.target.value)}
                        placeholder="Custom emoji ID"
                        className="w-full p-3 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]"
                    />

                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        placeholder="Duration (seconds)"
                        className="w-full p-3 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]"
                    />

                    <button onClick={requestAccess} className="btn-primary w-full">
                        Request Emoji Status Access
                    </button>

                    <button onClick={setEmojiStatus} className="btn-primary w-full">
                        Set Emoji Status
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Request emoji status access
webApp.requestEmojiStatusAccess((allowed) => {
  if (allowed) {
    // Can now set emoji status
  }
})

// Set emoji status
webApp.setEmojiStatus(
  'custom_emoji_id',
  { duration: 300 }, // 5 minutes
  (success) => {
    console.log('Status set:', success)
  }
)`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}