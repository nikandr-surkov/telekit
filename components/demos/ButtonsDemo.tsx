// components/demos/ButtonsDemo.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function ButtonsDemo() {
    const { webApp } = useTelegram()
    const [mainButtonClicks, setMainButtonClicks] = useState(0)

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
        } else {
            webApp?.MainButton.show()
        }
    }

    const toggleProgress = () => {
        if (webApp?.MainButton.isProgressVisible) {
            webApp?.MainButton.hideProgress()
        } else {
            webApp?.MainButton.showProgress()
        }
    }

    const changeSecondaryPosition = () => {
        const positions: Array<'left' | 'right' | 'top' | 'bottom'> = ['left', 'top', 'right', 'bottom']
        const currentIndex = positions.indexOf(webApp?.SecondaryButton.position || 'bottom')
        const nextPosition = positions[(currentIndex + 1) % positions.length]
        if (webApp?.SecondaryButton) {
            webApp.SecondaryButton.position = nextPosition
        }
    }

    return (
        <div className="space-y-6">
            <DemoSection title="🔘 Main Button">
                <div className="space-y-4">
                    <p>Main button clicks: {mainButtonClicks}</p>

                    <button onClick={toggleMainButton} className="btn-primary">
                        Toggle Main Button
                    </button>

                    <button onClick={toggleProgress} className="btn-primary">
                        Toggle Progress
                    </button>

                    <button
                        onClick={() => webApp?.MainButton.setText(`Clicks: ${mainButtonClicks}`)}
                        className="btn-primary"
                    >
                        Update Text
                    </button>
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
                    <button onClick={changeSecondaryPosition} className="btn-primary">
                        Change Position
                    </button>

                    <p className="text-sm">
                        Current position: {webApp?.SecondaryButton.position}
                    </p>
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
                    <button
                        onClick={() => webApp?.SettingsButton.isVisible
                            ? webApp.SettingsButton.hide()
                            : webApp?.SettingsButton.show()
                        }
                        className="btn-primary"
                    >
                        Toggle Settings Button
                    </button>
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
        </div>
    )
}