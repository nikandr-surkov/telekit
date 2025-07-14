// components/demos/ActivityDemo.tsx

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function ActivityDemo() {
    const { webApp } = useTelegram()
    const [activityData, setActivityData] = useState({
        isActive: true,
        currentDuration: 0,
        previousDuration: 0,
        activatedAt: new Date()
    })

    useEffect(() => {
        if (!webApp) return

        let interval: NodeJS.Timeout

        const handleActivated = () => {
            setActivityData(prev => ({
                ...prev,
                isActive: true,
                activatedAt: new Date()
            }))

            interval = setInterval(() => {
                setActivityData(prev => ({
                    ...prev,
                    currentDuration: Date.now() - prev.activatedAt.getTime()
                }))
            }, 100)
        }

        const handleDeactivated = () => {
            clearInterval(interval)
            setActivityData(prev => ({
                ...prev,
                isActive: false,
                previousDuration: Date.now() - prev.activatedAt.getTime()
            }))
        }

        webApp.onEvent('activated', handleActivated)
        webApp.onEvent('deactivated', handleDeactivated)

        if (webApp.isActive) {
            handleActivated()
        }

        return () => {
            clearInterval(interval)
            webApp.offEvent('activated', handleActivated)
            webApp.offEvent('deactivated', handleDeactivated)
        }
    }, [webApp])

    return (
        <div className="space-y-6">
            <DemoSection title="📊 Activity Tracking">
                <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                    <div className="space-y-2">
                        <div>
                            Status: <span className="font-bold">
                                {activityData.isActive ? '🟢 Active' : '🔴 Inactive'}
                            </span>
                        </div>
                        <div>
                            Current Session: {Math.round(activityData.currentDuration / 1000)}s
                        </div>
                        {activityData.previousDuration > 0 && (
                            <div className="text-sm text-[var(--tg-theme-hint-color)]">
                                Previous Session: {Math.round(activityData.previousDuration / 1000)}s
                            </div>
                        )}
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Track user activity
webApp.onEvent('activated', () => {
  console.log('Mini App activated')
  resumeGame()
})

webApp.onEvent('deactivated', () => {
  console.log('Mini App deactivated')
  pauseGame()
  saveProgress()
})

// Check current status
if (webApp.isActive) {
  // App is currently active
}`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}