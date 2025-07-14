// components/demos/AboutDemo.tsx

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

'use client'

import { motion } from 'framer-motion'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function AboutDemo() {
    const { webApp } = useTelegram()

    const links = [
        {
            title: 'Website',
            url: 'https://nikandr.com',
            icon: '🌐',
            description: 'Learn from zero to viral growth'
        },
        {
            title: 'YouTube',
            url: 'https://www.youtube.com/@NikandrSurkov',
            icon: '📺',
            description: 'Latest insights and tutorials'
        },
        {
            title: 'Telegram Channel',
            url: 'https://t.me/NikandrApps',
            icon: '📢',
            description: 'The best community'
        },
        {
            title: 'GitHub',
            url: 'https://github.com/nikandr-surkov',
            icon: '💻',
            description: 'Open source projects'
        }
    ]

    const achievements = [
        { icon: '🚀', title: 'Mini Apps with viral growth', description: 'Learn strategies that actually work' },
        { icon: '🤖', title: 'Bots processing millions', description: 'Scale your bots to handle real traffic' },
        { icon: '⛓️', title: 'TON blockchain integrations', description: 'Build on the fastest blockchain' },
        { icon: '🎯', title: 'Production-ready code', description: 'Real projects, not toy examples' }
    ]

    const handleLinkClick = (url: string) => {
        webApp?.HapticFeedback.impactOccurred('light')
        if (url.includes('t.me')) {
            webApp?.openTelegramLink(url)
        } else {
            webApp?.openLink(url)
        }
    }

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 py-8"
            >
                <div className="relative inline-block">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-50"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.3, 0.5]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <h1 className="relative text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Nikandr Surkov
                    </h1>
                </div>
                <p className="text-xl text-[var(--tg-theme-hint-color)]">
                    Master Telegram & blockchain through video guides that actually work
                </p>
            </motion.div>

            {/* What I Help You Build */}
            <DemoSection title="🚀 What I Help You Build">
                <div className="grid gap-3">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg flex gap-4"
                        >
                            <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{achievement.title}</h3>
                                <p className="text-sm text-[var(--tg-theme-hint-color)]">
                                    {achievement.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </DemoSection>

            {/* Links */}
            <DemoSection title="🔗 Connect & Learn">
                <div className="grid gap-3">
                    {links.map((link, index) => (
                        <motion.button
                            key={link.url}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleLinkClick(link.url)}
                            className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg flex items-center gap-4 w-full text-left hover:bg-opacity-80 transition-all"
                        >
                            <div className="text-2xl">{link.icon}</div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{link.title}</h3>
                                <p className="text-sm text-[var(--tg-theme-hint-color)]">
                                    {link.description}
                                </p>
                            </div>
                            <div className="text-[var(--tg-theme-hint-color)]">→</div>
                        </motion.button>
                    ))}
                </div>
            </DemoSection>

            {/* About This Project */}
            <DemoSection title="📱 About Telegram Dev Kit">
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <p className="text-sm leading-relaxed">
                            This interactive playground showcases every Telegram Mini App capability with live demos
                            and production-ready code examples. Built to help developers quickly understand and
                            implement Telegram's powerful APIs.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-center">
                            <div className="text-2xl mb-1">17+</div>
                            <div className="text-[var(--tg-theme-hint-color)]">API Demos</div>
                        </div>
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-center">
                            <div className="text-2xl mb-1">50+</div>
                            <div className="text-[var(--tg-theme-hint-color)]">Code Examples</div>
                        </div>
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-center">
                            <div className="text-2xl mb-1">100%</div>
                            <div className="text-[var(--tg-theme-hint-color)]">TypeScript</div>
                        </div>
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-center">
                            <div className="text-2xl mb-1">♾️</div>
                            <div className="text-[var(--tg-theme-hint-color)]">Limitless Possibilities</div>
                        </div>
                    </div>
                </div>
            </DemoSection>

            {/* Website */}
            <DemoSection title="🎯 Ready to Build?">
                <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg text-center space-y-4">
                        <h3 className="text-xl font-semibold">From zero to deployed app</h3>
                        <p className="text-[var(--tg-theme-hint-color)]">
                            No fluff, just results. Start building something amazing today.
                        </p>
                        <button
                            onClick={() => handleLinkClick('https://nikandr.com')}
                            className="btn-primary px-8 py-3 text-lg"
                        >
                            Start Learning → nikandr.com
                        </button>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            <strong>⚠️ Important:</strong> This project was developed by Nikandr Surkov.
                            You may use this code only if purchased from the official website nikandr.com.
                            See license for details.
                        </p>
                    </div>
                </div>
            </DemoSection>

            {/* Example Integration */}
            <DemoSection title="💡 Quick Start Example">
                <CodeBlock language="typescript">
                    {`// Get started with Telegram Mini Apps in 3 steps

// 1. Install dependencies
npm install @twa-dev/sdk

// 2. Initialize in your app
import WebApp from '@twa-dev/sdk'

WebApp.ready()
WebApp.expand()

// 3. Start building!
WebApp.MainButton.text = "Click Me!"
WebApp.MainButton.show()
WebApp.MainButton.onClick(() => {
  WebApp.HapticFeedback.notificationOccurred('success')
  console.log('Building something amazing!')
})

// Learn more at nikandr.com`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}