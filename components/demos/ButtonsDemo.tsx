// components/demos/ButtonsDemo.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function ButtonsDemo() {
    const { webApp } = useTelegram()
    const [mainButtonClicks, setMainButtonClicks] = useState(0)
    const [isMainButtonVisible, setIsMainButtonVisible] = useState(true)
    const [isProgressVisible, setIsProgressVisible] = useState(false)
    const [isSettingsVisible, setIsSettingsVisible] = useState(false)
    const [isSecondaryVisible, setIsSecondaryVisible] = useState(true)
    const [isBackButtonVisible, setIsBackButtonVisible] = useState(true)
    const [secondaryPosition, setSecondaryPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('bottom')

    useEffect(() => {
        if (!webApp) return

        // Setup Main Button
        webApp.MainButton.setParams({
            text: 'Click Me! 🎮',
            color: '#FF6B6B',
            has_shine_effect: true,
            is_visible: true,
        })

        const handleMainClick = () => {
            setMainButtonClicks(c => c + 1)
            webApp.HapticFeedback.impactOccurred('medium')
        }

        webApp.MainButton.onClick(handleMainClick)

        // Setup Secondary Button
        webApp.SecondaryButton.setParams({
            text: 'Secondary Action',
            is_visible: true,
        })

        // Setup Back Button
        webApp.BackButton.show()
        webApp.BackButton.onClick(() => {
            webApp.showAlert('Back button pressed!')
        })

        // Initialize states based on actual button visibility
        setIsSecondaryVisible(webApp.SecondaryButton.isVisible)
        setIsBackButtonVisible(webApp.BackButton.isVisible)

        return () => {
            webApp.MainButton.offClick(handleMainClick)
            webApp.MainButton.hide()
            webApp.SecondaryButton.hide()
            webApp.BackButton.hide()
        }
    }, [webApp])

    const toggleMainButton = () => {
        if (webApp?.MainButton.isVisible) {
            webApp?.MainButton.hide()
            setIsMainButtonVisible(false)
        } else {
            webApp?.MainButton.show()
            setIsMainButtonVisible(true)
        }
    }

    const toggleProgress = () => {
        if (webApp?.MainButton.isProgressVisible) {
            webApp?.MainButton.hideProgress()
            setIsProgressVisible(false)
        } else {
            webApp?.MainButton.showProgress()
            setIsProgressVisible(true)
        }
    }

    const changeSecondaryPosition = () => {
        const positions: Array<'left' | 'right' | 'top' | 'bottom'> = ['left', 'top', 'right', 'bottom']
        const currentIndex = positions.indexOf(secondaryPosition)
        const nextPosition = positions[(currentIndex + 1) % positions.length]
        if (webApp?.SecondaryButton) {
            webApp.SecondaryButton.position = nextPosition
            setSecondaryPosition(nextPosition)
        }
    }

    const toggleSettingsButton = () => {
        if (webApp?.SettingsButton.isVisible) {
            webApp.SettingsButton.hide()
            setIsSettingsVisible(false)
        } else {
            webApp?.SettingsButton.show()
            setIsSettingsVisible(true)
        }
    }

    const toggleSecondaryButton = () => {
        if (webApp?.SecondaryButton.isVisible) {
            webApp.SecondaryButton.hide()
            setIsSecondaryVisible(false)
        } else {
            webApp?.SecondaryButton.show()
            setIsSecondaryVisible(true)
        }
    }

    const toggleBackButton = () => {
        if (webApp?.BackButton.isVisible) {
            webApp.BackButton.hide()
            setIsBackButtonVisible(false)
        } else {
            webApp?.BackButton.show()
            setIsBackButtonVisible(true)
        }
    }

    return (
        <div className="space-y-6">
            <DemoSection title="🔘 Main Button">
                <div className="space-y-4">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <p className="text-sm">Main button clicks: <span className="font-bold">{mainButtonClicks}</span></p>
                        <p className="text-sm">Visibility: <span className="font-bold">{isMainButtonVisible ? 'Visible' : 'Hidden'}</span></p>
                        <p className="text-sm">Progress: <span className="font-bold">{isProgressVisible ? 'Showing' : 'Hidden'}</span></p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={toggleMainButton} className="btn-primary w-full">
                            {isMainButtonVisible ? '🙈 Hide' : '👁️ Show'} Main Button
                        </button>

                        <button onClick={toggleProgress} className="btn-primary w-full">
                            {isProgressVisible ? '⏸️ Hide' : '▶️ Show'} Progress
                        </button>

                        <button
                            onClick={() => webApp?.MainButton.setText(`Clicks: ${mainButtonClicks}`)}
                            className="btn-primary w-full"
                        >
                            📝 Update Text to "Clicks: {mainButtonClicks}"
                        </button>

                        <button
                            onClick={() => {
                                webApp?.MainButton.setText('Loading...')
                                webApp?.MainButton.showProgress()
                                setIsProgressVisible(true)
                                setTimeout(() => {
                                    webApp?.MainButton.hideProgress()
                                    webApp?.MainButton.setText('Done! ✅')
                                    setIsProgressVisible(false)
                                }, 2000)
                            }}
                            className="btn-primary w-full"
                        >
                            🎬 Demo Loading State (2s)
                        </button>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Main Button setup
webApp.MainButton.setParams({
  text: 'Start Game',
  color: '#FF6B6B',
  has_shine_effect: true,
  is_visible: true
})

webApp.MainButton.onClick(() => {
  // Handle click
  startGame()
})

// Show progress
webApp.MainButton.showProgress()

// Update dynamically
webApp.MainButton.setText('Loading...')`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🔲 Secondary Button">
                <div className="space-y-4">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <p className="text-sm">Visibility: <span className="font-bold">{isSecondaryVisible ? 'Visible' : 'Hidden'}</span></p>
                        <p className="text-sm">Current position: <span className="font-bold">{secondaryPosition}</span></p>
                        <p className="text-xs text-[var(--tg-theme-hint-color)] mt-1">
                            Secondary button appears alongside the main button
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={changeSecondaryPosition} className="btn-primary w-full">
                            🔄 Change Position to{' '}
                            {secondaryPosition === 'bottom' ? 'Left' :
                                secondaryPosition === 'left' ? 'Top' :
                                    secondaryPosition === 'top' ? 'Right' : 'Bottom'}
                        </button>

                        <button
                            onClick={toggleSecondaryButton}
                            className="btn-primary w-full"
                        >
                            {isSecondaryVisible ? '🙈 Hide' : '👁️ Show'} Secondary Button
                        </button>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Secondary Button with position
webApp.SecondaryButton.setParams({
  text: 'Options',
  is_visible: true
})

// Change position
webApp.SecondaryButton.position = 'left'

webApp.SecondaryButton.onClick(() => {
  showOptions()
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="⬅️ Navigation Buttons">
                <div className="space-y-4">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <p className="text-sm">Settings Button: <span className="font-bold">{isSettingsVisible ? 'Visible' : 'Hidden'}</span></p>
                        <p className="text-sm">Back Button: <span className="font-bold">{isBackButtonVisible ? 'Visible' : 'Hidden'}</span></p>
                        <p className="text-xs text-[var(--tg-theme-hint-color)] mt-2">
                            Navigation buttons appear in the Mini App header
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={toggleSettingsButton}
                            className="btn-primary w-full"
                        >
                            {isSettingsVisible ? '🙈 Hide' : '⚙️ Show'} Settings Button
                        </button>

                        <button
                            onClick={toggleBackButton}
                            className="btn-primary w-full"
                        >
                            {isBackButtonVisible ? '🙈 Hide' : '⬅️ Show'} Back Button
                        </button>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Back Button
webApp.BackButton.show()
webApp.BackButton.onClick(() => {
  navigateBack()
})

// Settings Button  
webApp.SettingsButton.show()
webApp.SettingsButton.onClick(() => {
  openSettings()
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="💡 Button States Demo">
                <div className="space-y-4">
                    <p className="text-sm text-[var(--tg-theme-hint-color)]">
                        Try these button combinations to see how they work together:
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => {
                                // Show loading state
                                webApp?.MainButton.show()
                                webApp?.MainButton.setText('Processing...')
                                webApp?.MainButton.showProgress()
                                webApp?.MainButton.disable()
                                setIsMainButtonVisible(true)
                                setIsProgressVisible(true)
                            }}
                            className="btn-secondary w-full"
                        >
                            🔄 Set Loading State
                        </button>

                        <button
                            onClick={() => {
                                // Show success state
                                webApp?.MainButton.show()
                                webApp?.MainButton.setText('Success! ✅')
                                webApp?.MainButton.hideProgress()
                                webApp?.MainButton.enable()
                                webApp?.MainButton.setParams({ color: '#4CAF50' })
                                setIsMainButtonVisible(true)
                                setIsProgressVisible(false)
                            }}
                            className="btn-secondary w-full"
                        >
                            ✅ Set Success State
                        </button>

                        <button
                            onClick={() => {
                                // Reset to default
                                webApp?.MainButton.setParams({
                                    text: 'Click Me! 🎮',
                                    color: '#FF6B6B',
                                    has_shine_effect: true,
                                    is_visible: true,
                                })
                                webApp?.MainButton.hideProgress()
                                webApp?.MainButton.enable()
                                setIsMainButtonVisible(true)
                                setIsProgressVisible(false)
                            }}
                            className="btn-secondary w-full"
                        >
                            🔄 Reset to Default
                        </button>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}