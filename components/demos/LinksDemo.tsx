// components/demos/LinksDemo.tsx
'use client'

import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function LinksDemo() {
    const { webApp } = useTelegram()

    const links = [
        {
            title: 'Regular Link',
            description: 'Opens inside webview',
            action: () => window.location.href = 'https://telegram.org',
            code: `window.location.href = 'https://telegram.org'`
        },
        {
            title: 'External Link (target="_blank")',
            description: 'Opens outside webview',
            action: () => {
                const a = document.createElement('a')
                a.href = 'https://telegram.org'
                a.target = '_blank'
                a.click()
            },
            code: `<a href="https://telegram.org" target="_blank">Open</a>`
        },
        {
            title: 'window.open() Link',
            description: 'Opens in external browser',
            action: () => window.open('https://telegram.org'),
            code: `window.open('https://telegram.org')`
        },
        {
            title: 'Telegram Link (t.me)',
            description: 'Opens inside Telegram app',
            action: () => webApp?.openTelegramLink('https://t.me/telegram'),
            code: `webApp.openTelegramLink('https://t.me/telegram')`
        },
        {
            title: 'Instant View Link',
            description: 'Opens with Telegram Instant View',
            action: () => webApp?.openLink('https://telegra.ph/api', { try_instant_view: true }),
            code: `webApp.openLink('https://telegra.ph/api', { try_instant_view: true })`
        },
        {
            title: 'Bot Direct Link',
            description: 'Opens bot with start parameter',
            action: () => webApp?.openTelegramLink('https://t.me/DurgerKingBot/menu'),
            code: `webApp.openTelegramLink('https://t.me/BotName/menu')`
        },
        {
            title: 'Channel Link',
            description: 'Opens Telegram channel',
            action: () => webApp?.openTelegramLink('https://t.me/telegram'),
            code: `webApp.openTelegramLink('https://t.me/channelname')`
        },
        {
            title: 'Sticker Pack',
            description: 'Add sticker pack',
            action: () => webApp?.openTelegramLink('https://t.me/addstickers/fltmp'),
            code: `webApp.openTelegramLink('https://t.me/addstickers/packname')`
        },
        {
            title: 'Share URL',
            description: 'Share URL via Telegram',
            action: () => webApp?.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://example.com')}&text=${encodeURIComponent('Check this out!')}`),
            code: `webApp.openTelegramLink('https://t.me/share/url?url=...')`
        }
    ]

    const browserOptions = [
        { name: 'Chrome', value: 'chrome' as const },
        { name: 'Safari', value: 'safari' as const },
        { name: 'Firefox', value: 'firefox' as const },
        { name: 'Opera', value: 'opera' as const }
    ]

    return (
        <div className="space-y-6">
            <DemoSection title="🔗 Link Types">
                <div className="space-y-3">
                    {links.map((link, index) => (
                        <div key={index} className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h4 className="font-semibold">{link.title}</h4>
                                    <p className="text-sm text-[var(--tg-theme-hint-color)]">{link.description}</p>
                                </div>
                                <button
                                    onClick={link.action}
                                    className="btn-primary px-4 py-2 ml-4"
                                >
                                    Open
                                </button>
                            </div>
                            <div className="mt-2 overflow-x-auto">
                                <code className="text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded">
                                    {link.code}
                                </code>
                            </div>
                        </div>
                    ))}
                </div>
            </DemoSection>

            <DemoSection title="🌐 Browser Selection">
                <div className="space-y-4">
                    <p className="text-sm text-[var(--tg-theme-hint-color)]">
                        Force links to open in specific browsers:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {browserOptions.map((browser) => (
                            <button
                                key={browser.value}
                                onClick={() => webApp?.openLink('https://telegram.org', { try_browser: browser.value })}
                                className="btn-secondary"
                            >
                                Open in {browser.name}
                            </button>
                        ))}
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Force specific browser
webApp.openLink('https://example.com', {
  try_browser: 'chrome' // or 'safari', 'firefox', 'opera'
})

// Regular external link
webApp.openLink('https://example.com')

// Telegram links must use openTelegramLink
webApp.openTelegramLink('https://t.me/channelname')

// Share URL with text
const shareUrl = 'https://t.me/share/url?' + 
  'url=' + encodeURIComponent('https://myapp.com') +
  '&text=' + encodeURIComponent('Check out my score!')
  
webApp.openTelegramLink(shareUrl)`}
                </CodeBlock>
            </DemoSection>

        </div>
    )
}