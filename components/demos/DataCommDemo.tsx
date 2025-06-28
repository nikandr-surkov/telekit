// components/demos/DataCommDemo.tsx
'use client'

import { useState } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function DataCommDemo() {
    const { webApp } = useTelegram()
    const [message, setMessage] = useState('')
    const [inlineQuery, setInlineQuery] = useState('')

    const sendData = () => {
        if (!message) {
            webApp?.showAlert('Please enter a message')
            return
        }
        webApp?.sendData(message)
        webApp?.HapticFeedback.notificationOccurred('success')
    }

    const sendTime = () => {
        const currentTime = new Date().toISOString()
        webApp?.sendData(JSON.stringify({
            type: 'time',
            timestamp: currentTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }))
    }

    const switchInline = () => {
        webApp?.switchInlineQuery(inlineQuery || 'game_score:1000', ['users', 'groups'])
    }

    const invokeCustomMethod = () => {
        webApp?.invokeCustomMethod('getCurrentTime', {}, (err, time) => {
            if (err) {
                webApp.showAlert(`Error: ${err}`)
            } else {
                webApp.showAlert(`Server time: ${new Date(time * 1000).toLocaleString()}`)
            }
        })
    }

    const toggleClosingConfirmation = () => {
        if (webApp?.isClosingConfirmationEnabled) {
            webApp.disableClosingConfirmation()
        } else {
            webApp?.enableClosingConfirmation()
        }
    }

    return (
        <div className="space-y-6">
            <DemoSection title="📤 Send Data to Bot">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter message to send"
                        className="w-full p-3 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]"
                    />

                    <button onClick={sendData} className="btn-primary w-full">
                        Send Data to Bot
                    </button>

                    <button onClick={sendTime} className="btn-primary w-full">
                        Send Current Time
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Send data to bot (keyboard button only)
webApp.sendData(JSON.stringify({
  action: 'submit_score',
  score: 1000,
  level: 5
}))

// Bot receives via web_app_data event
bot.on('web_app_data', (ctx) => {
  const data = JSON.parse(ctx.webAppData.data.text())
  console.log('Received:', data)
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🔄 Inline Query">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={inlineQuery}
                        onChange={(e) => setInlineQuery(e.target.value)}
                        placeholder="Inline query text"
                        className="w-full p-3 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]"
                    />

                    <button onClick={switchInline} className="btn-primary w-full">
                        Switch to Inline Mode
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Switch to inline mode
webApp.switchInlineQuery(
  'search_query',
  ['users', 'groups'] // allowed chat types
)`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🔧 Custom Methods">
                <div className="space-y-4">
                    <button onClick={invokeCustomMethod} className="btn-primary w-full">
                        Get Server Time
                    </button>

                    <button onClick={toggleClosingConfirmation} className="btn-primary w-full">
                        {webApp?.isClosingConfirmationEnabled ? 'Disable' : 'Enable'} Closing Confirmation
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Invoke custom bot method
webApp.invokeCustomMethod(
  'customMethod',
  { param: 'value' },
  (err, result) => {
    if (!err) {
      console.log('Result:', result)
    }
  }
)

// Enable closing confirmation
webApp.enableClosingConfirmation()`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}