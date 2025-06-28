// components/demos/GameFeaturesDemo.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'
import type { LocationData } from '@/types/telegram'

export default function GameFeaturesDemo() {
    const { webApp } = useTelegram()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isOrientationLocked, setIsOrientationLocked] = useState(false)
    const [locationData, setLocationData] = useState<LocationData | null>(null)
    const [homeScreenStatus, setHomeScreenStatus] = useState<string>('')

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
        } else {
            webApp?.enableVerticalSwipes()
        }
    }

    const getLocation = () => {
        webApp?.LocationManager.getLocation((location: LocationData | null) => {
            if (location) {
                setLocationData(location)
                webApp.HapticFeedback.notificationOccurred('success')
            } else {
                webApp.showAlert('Location access denied')
            }
        })
    }

    const checkHomeScreen = () => {
        webApp?.checkHomeScreenStatus((status: string) => {
            setHomeScreenStatus(status)
        })
    }

    const showQRScanner = () => {
        webApp?.showScanQrPopup(
            { text: 'Scan QR code to unlock bonus level' },
            (text: string) => {
                webApp.showAlert(`Scanned: ${text}`)
                return true
            }
        )
    }

    const showGamePopup = () => {
        webApp?.showPopup({
            title: 'Game Over!',
            message: 'You scored 1,234 points! What would you like to do?',
            buttons: [
                { id: 'restart', type: 'default', text: 'Play Again' },
                { id: 'share', type: 'default', text: 'Share Score' },
                { type: 'cancel', text: 'Exit' }
            ]
        }, (buttonId: string | null) => {
            if (buttonId === 'restart') {
                webApp.showAlert('Restarting game...')
            } else if (buttonId === 'share') {
                webApp.shareToStory('https://example.com/score.jpg', {
                    text: 'I just scored 1,234 points! Can you beat my score?'
                })
            }
        })
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
                        {webApp?.isVerticalSwipesEnabled ? 'Disable' : 'Enable'} Vertical Swipes
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

            <DemoSection title="📍 Location Features">
                <div className="space-y-4">
                    <button onClick={getLocation} className="btn-primary w-full">
                        Get Location
                    </button>

                    {locationData && (
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-sm">
                            <div>Lat: {locationData.latitude.toFixed(6)}</div>
                            <div>Lng: {locationData.longitude.toFixed(6)}</div>
                            {locationData.altitude && <div>Alt: {locationData.altitude.toFixed(2)}m</div>}
                            {locationData.speed && <div>Speed: {locationData.speed.toFixed(2)}m/s</div>}
                        </div>
                    )}
                </div>

                <CodeBlock language="typescript">
                    {`// Location-based gaming
webApp.LocationManager.init()

webApp.LocationManager.getLocation((location) => {
  if (location) {
    // Use for AR games, geocaching, etc
    spawnNearbyItems(
      location.latitude,
      location.longitude
    )
  }
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="📱 App Features">
                <div className="space-y-4">
                    <button onClick={() => webApp?.addToHomeScreen()} className="btn-primary w-full">
                        Add to Home Screen
                    </button>

                    <button onClick={checkHomeScreen} className="btn-primary w-full">
                        Check Home Screen Status
                    </button>

                    {homeScreenStatus && (
                        <p className="text-sm text-center">Status: {homeScreenStatus}</p>
                    )}

                    <button onClick={showQRScanner} className="btn-primary w-full">
                        Open QR Scanner
                    </button>

                    <button onClick={showGamePopup} className="btn-primary w-full">
                        Show Game Popup
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Add to home screen for quick access
webApp.addToHomeScreen()

// QR code for bonus content
webApp.showScanQrPopup({
  text: 'Scan to unlock bonus'
}, (qrText) => {
  unlockBonus(qrText)
  return true
})

// Game popups
webApp.showPopup({
  title: 'Level Complete!',
  message: 'You earned 3 stars!',
  buttons: [
    { id: 'next', text: 'Next Level' },
    { id: 'replay', text: 'Replay' },
    { type: 'cancel' }
  ]
}, handleGameAction)`}
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