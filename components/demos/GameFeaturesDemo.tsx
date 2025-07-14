// components/demos/GameFeaturesDemo.tsx

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

export default function GameFeaturesDemo() {
    const { webApp } = useTelegram()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isOrientationLocked, setIsOrientationLocked] = useState(false)
    const [swipesEnabled, setSwipesEnabled] = useState(true)

    useEffect(() => {
        if (!webApp) return

        webApp.onEvent('fullscreenChanged', () => {
            setIsFullscreen(webApp.isFullscreen)
        })

        // Initialize location manager
        webApp.LocationManager.init()

        return () => {
            webApp.offEvent('fullscreenChanged', () => { })
        }
    }, [webApp])

    const toggleFullscreen = () => {
        if (webApp?.isFullscreen) {
            webApp?.exitFullscreen()
        } else {
            webApp?.requestFullscreen()
        }
    }

    const toggleOrientation = () => {
        if (webApp?.isOrientationLocked) {
            webApp?.unlockOrientation()
            setIsOrientationLocked(false)
        } else {
            webApp?.lockOrientation()
            setIsOrientationLocked(true)
        }
    }

    const toggleSwipes = () => {
        if (webApp?.isVerticalSwipesEnabled) {
            webApp?.disableVerticalSwipes()
            setSwipesEnabled(false)
        } else {
            webApp?.enableVerticalSwipes()
            setSwipesEnabled(true)
        }
    }

    return (
        <div className="space-y-6">
            <DemoSection title="🎮 Game Controls">
                <div className="space-y-4">
                    <button onClick={toggleFullscreen} className="btn-primary w-full">
                        {isFullscreen ? 'Exit' : 'Enter'} Fullscreen
                    </button>

                    <button onClick={toggleOrientation} className="btn-primary w-full">
                        {isOrientationLocked ? 'Unlock' : 'Lock'} Orientation
                    </button>

                    <button onClick={toggleSwipes} className="btn-primary w-full">
                        {swipesEnabled ? 'Disable' : 'Enable'} Vertical Swipes
                        {!swipesEnabled && ' (Good for games!)'}
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Fullscreen for immersive gaming
webApp.requestFullscreen()
webApp.onEvent('fullscreenChanged', () => {
  if (webApp.isFullscreen) {
    showGameUI()
  }
})

// Lock orientation for consistent gameplay
webApp.lockOrientation()

// Disable swipes for game controls
webApp.disableVerticalSwipes()`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🎯 Mini Game Example">
                <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                    <TapGame />
                </div>
            </DemoSection>
        </div>
    )
}

// Mini tap game component
function TapGame() {
    const { webApp } = useTelegram()
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (!isPlaying || timeLeft <= 0) return

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1)
            if (timeLeft === 1) {
                endGame()
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [isPlaying, timeLeft])

    const startGame = () => {
        setScore(0)
        setTimeLeft(10)
        setIsPlaying(true)
        webApp?.HapticFeedback.notificationOccurred('success')
    }

    const endGame = () => {
        setIsPlaying(false)
        webApp?.HapticFeedback.notificationOccurred('warning')
        webApp?.MainButton.setText(`Score: ${score}`)
        webApp?.MainButton.show()
    }

    const tap = () => {
        if (!isPlaying) return
        setScore(score + 1)
        webApp?.HapticFeedback.impactOccurred('light')
    }

    return (
        <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Tap Game</h3>

            {!isPlaying ? (
                <button onClick={startGame} className="btn-primary">
                    Start Game
                </button>
            ) : (
                <>
                    <div className="text-3xl font-bold">{timeLeft}s</div>
                    <div className="text-2xl">Score: {score}</div>
                    <button
                        onClick={tap}
                        className="w-32 h-32 bg-[var(--tg-theme-button-color)] rounded-full text-4xl animate-pulse"
                    >
                        👆
                    </button>
                </>
            )}
        </div>
    )
}