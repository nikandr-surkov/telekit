// components/demos/PopupsDemo.tsx
'use client'

import { useState } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function PopupsDemo() {
    const { webApp } = useTelegram()
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    // Helper function to safely show popup
    const safeShowPopup = (params: any, callback?: (buttonId: string | null) => void) => {
        if (isPopupOpen) {
            webApp?.showAlert('Please close the current popup first')
            return
        }

        setIsPopupOpen(true)
        webApp?.showPopup(params, (buttonId) => {
            setIsPopupOpen(false)
            if (callback) {
                // Wrap callback in try-catch to handle any errors
                try {
                    callback(buttonId)
                } catch (e) {
                    console.error('Error in popup callback:', e)
                    // Reset state if error occurs
                    setIsPopupOpen(false)
                }
            }
        })
    }

    const showBasicPopup = () => {
        safeShowPopup({
            title: 'Basic Popup',
            message: 'This is a simple popup message',
            buttons: [{ type: 'ok' }]
        }, (buttonId) => {
            console.log('Button pressed:', buttonId)
        })
    }

    const showMultiButtonPopup = () => {
        safeShowPopup({
            title: 'Save Changes?',
            message: 'You have unsaved changes. What would you like to do?',
            buttons: [
                { id: 'save', type: 'default', text: 'Save' },
                { id: 'discard', type: 'destructive', text: 'Discard' },
                { type: 'cancel' }
            ]
        }, (buttonId) => {
            // Use setTimeout to ensure popup is fully closed
            setTimeout(() => {
                // Reset popup state before showing alert
                setIsPopupOpen(false)
                switch (buttonId) {
                    case 'save':
                        console.log('Changes saved!')
                        webApp?.HapticFeedback.notificationOccurred('success')
                        break
                    case 'discard':
                        console.log('Changes discarded')
                        webApp?.HapticFeedback.notificationOccurred('warning')
                        break
                    default:
                        console.log('Cancelled')
                }
            }, 100)
        })
    }

    const showDestructivePopup = () => {
        safeShowPopup({
            title: 'Delete Account',
            message: 'Are you sure you want to delete your account? This action cannot be undone.',
            buttons: [
                { id: 'delete', type: 'destructive', text: 'Delete Account' },
                { type: 'cancel', text: 'Keep Account' }
            ]
        }, (buttonId) => {
            if (buttonId === 'delete') {
                setTimeout(() => {
                    setIsPopupOpen(false)
                    webApp?.HapticFeedback.notificationOccurred('warning')
                    console.log('Account deletion initiated')
                }, 100)
            }
        })
    }

    const showGameOverPopup = () => {
        safeShowPopup({
            title: '🎮 Game Over!',
            message: 'You scored 1,234 points!\n\nThat\'s a new high score! 🎉',
            buttons: [
                { id: 'replay', type: 'default', text: '🔄 Play Again' },
                { id: 'share', type: 'default', text: '📤 Share Score' },
                { type: 'close', text: 'Exit' }
            ]
        }, (buttonId) => {
            // Use setTimeout to ensure actions happen after popup closes
            setTimeout(() => {
                setIsPopupOpen(false)
                switch (buttonId) {
                    case 'replay':
                        console.log('Starting new game...')
                        webApp?.HapticFeedback.notificationOccurred('success')
                        break
                    case 'share':
                        // Don't try switchInlineQuery unless we're sure it's available
                        if (webApp?.initDataUnsafe?.query_id) {
                            try {
                                webApp.switchInlineQuery('I just scored 1,234 points! Can you beat me?', ['users'])
                            } catch (e) {
                                console.error('Inline query error:', e)
                                // Fallback to URL sharing
                                webApp?.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/yourbotname')}&text=${encodeURIComponent('I just scored 1,234 points! Can you beat me?')}`)
                            }
                        } else {
                            // Direct fallback to URL sharing
                            webApp?.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/yourbotname')}&text=${encodeURIComponent('I just scored 1,234 points! Can you beat me?')}`)
                        }
                        break
                    default:
                        console.log('Game closed')
                }
            }, 100)
        })
    }

    const showGameMenuPopup = () => {
        safeShowPopup({
            title: '🎮 Game Menu',
            message: 'What would you like to do?',
            buttons: [
                { id: 'continue', type: 'default', text: 'Continue Playing' },
                { id: 'options', type: 'default', text: 'Game Options' },
                { id: 'quit', type: 'destructive', text: 'Quit Game' }
            ]
        }, (buttonId) => {
            setTimeout(() => {
                setIsPopupOpen(false)
                switch (buttonId) {
                    case 'continue':
                        console.log('Resuming game...')
                        webApp?.HapticFeedback.notificationOccurred('success')
                        break
                    case 'options':
                        // Add delay before showing next popup
                        setTimeout(() => {
                            showOptionsPopup()
                        }, 200)
                        break
                    case 'quit':
                        // Use setTimeout for confirm dialog too
                        setTimeout(() => {
                            webApp?.showConfirm('Are you sure you want to quit?', (confirmed) => {
                                if (confirmed) {
                                    webApp?.close()
                                }
                            })
                        }, 100)
                        break
                }
            }, 100)
        })
    }

    const showOptionsPopup = () => {
        safeShowPopup({
            title: '⚙️ Game Options',
            message: 'Select an option:',
            buttons: [
                { id: 'sound', type: 'default', text: '🔊 Sound Settings' },
                { id: 'controls', type: 'default', text: '🎮 Controls' },
                { type: 'cancel', text: 'Back' }
            ]
        }, (buttonId) => {
            setTimeout(() => {
                setIsPopupOpen(false)

                // Use a single alert to confirm the action
                if (buttonId === 'sound') {
                    setTimeout(() => {
                        webApp?.showAlert(
                            '🔊 Sound Settings\n\n' +
                            'Master Volume: 80%\n' +
                            'Effects: ON\n' +
                            'Music: ON\n\n' +
                            '(In a real app, this would open a settings screen)'
                        )
                    }, 200)
                } else if (buttonId === 'controls') {
                    setTimeout(() => {
                        webApp?.showAlert(
                            '🎮 Control Settings\n\n' +
                            'Current: Touch Controls\n' +
                            'Available: Swipe, Tilt\n\n' +
                            '(In a real app, this would open a controls screen)'
                        )
                    }, 200)
                }
            }, 100)
        })
    }

    const compareAlerts = () => {
        // First show native alert
        alert('This is a native JavaScript alert')

        // Then show Telegram alert
        setTimeout(() => {
            webApp?.showAlert('This is a Telegram WebApp alert - much better styled!')
        }, 100)
    }

    const compareConfirms = () => {
        // First show native confirm
        const nativeResult = confirm('Native confirm: Continue?')
        console.log('Native result:', nativeResult)

        // Then show Telegram confirm
        setTimeout(() => {
            webApp?.showConfirm('Telegram confirm: Continue?', (result) => {
                // Log result instead of showing another alert
                console.log(`Telegram confirm result: ${result ? 'Yes' : 'No'}`)
                webApp?.HapticFeedback.notificationOccurred(result ? 'success' : 'warning')
            })
        }, 100)
    }

    // Test inline query availability
    const testInlineQuery = () => {
        safeShowPopup({
            title: '📤 Test Inline Query',
            message: 'This will test if inline mode is available',
            buttons: [
                { id: 'test', type: 'default', text: 'Test Inline' },
                { id: 'share', type: 'default', text: 'Alternative Share' },
                { type: 'cancel' }
            ]
        }, (buttonId) => {
            setTimeout(() => {
                setIsPopupOpen(false)
                if (buttonId === 'test') {
                    // Check if inline query is available before trying to use it
                    if (webApp?.initDataUnsafe?.query_id) {
                        try {
                            webApp.switchInlineQuery('Test message', ['users'])
                        } catch (e) {
                            console.error('Inline query error:', e)
                            // Delay the alert to avoid popup conflict
                            setTimeout(() => {
                                webApp.showAlert('Inline mode error. Please check if inline mode is enabled for this bot.')
                            }, 100)
                        }
                    } else {
                        // Don't try to call switchInlineQuery if we know it's not available
                        setTimeout(() => {
                            webApp?.showAlert(
                                'Inline mode is not available in this context.\n\n' +
                                'To enable inline mode:\n' +
                                '1. Go to @BotFather\n' +
                                '2. Send /setinline\n' +
                                '3. Select your bot\n' +
                                '4. Set placeholder text\n\n' +
                                'Note: Inline mode only works when the Mini App is opened from an inline query.'
                            )
                        }, 100)
                    }
                } else if (buttonId === 'share') {
                    // Alternative sharing via URL
                    webApp?.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/yourbotname')}&text=${encodeURIComponent('Check out this awesome Mini App!')}`)
                }
            }, 100)
        })
    }

    return (
        <div className="space-y-6">
            <DemoSection title="🔔 Popup Types">
                <div className="space-y-3">
                    <button onClick={showBasicPopup} className="btn-primary w-full">
                        Basic Popup (OK button)
                    </button>

                    <button onClick={showMultiButtonPopup} className="btn-primary w-full">
                        Multi-Button Popup (3 buttons)
                    </button>

                    <button onClick={showDestructivePopup} className="btn-primary w-full">
                        Destructive Action Popup
                    </button>

                    <button onClick={showGameOverPopup} className="btn-primary w-full">
                        Game Over Popup (with Share)
                    </button>

                    <button onClick={showGameMenuPopup} className="btn-primary w-full">
                        Game Menu Popup
                    </button>

                    <button onClick={testInlineQuery} className="btn-primary w-full">
                        Test Inline Query
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Safe popup handling - avoid nested popups!
const [isPopupOpen, setIsPopupOpen] = useState(false)

function safeShowPopup(params, callback) {
  if (isPopupOpen) return
  
  setIsPopupOpen(true)
  webApp.showPopup(params, (buttonId) => {
    setIsPopupOpen(false)
    
    // Important: Use console.log instead of showAlert
    // inside popup callbacks to avoid conflicts
    setTimeout(() => {
      try {
        callback(buttonId)
      } catch (e) {
        console.error('Popup callback error:', e)
      }
    }, 100)
  })
}

// Never call showAlert inside a popup callback!
// Use console.log or haptic feedback instead:
webApp.HapticFeedback.notificationOccurred('success')

// If you must show an alert after a popup, delay it:
setTimeout(() => {
  webApp.showAlert('Action completed!')
}, 200)`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🆚 Native vs Telegram Alerts">
                <div className="space-y-3">
                    <button onClick={compareAlerts} className="btn-secondary w-full">
                        Compare alert() vs showAlert()
                    </button>

                    <button onClick={compareConfirms} className="btn-secondary w-full">
                        Compare confirm() vs showConfirm()
                    </button>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-sm">
                        <p className="font-semibold mb-2">Why use Telegram popups?</p>
                        <ul className="space-y-1 text-[var(--tg-theme-hint-color)]">
                            <li>• Consistent styling with Telegram UI</li>
                            <li>• Better mobile experience</li>
                            <li>• Non-blocking (doesn't freeze the app)</li>
                            <li>• Supports multiple buttons and types</li>
                            <li>• Proper theme support</li>
                        </ul>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title="⚠️ Important: Avoid Nested Popups">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                        Common Popup Mistakes
                    </h4>
                    <ul className="text-sm space-y-1">
                        <li>❌ Don't call showAlert() inside popup callbacks</li>
                        <li>❌ Don't call showPopup() immediately after another popup</li>
                        <li>❌ Don't call showConfirm() inside popup callbacks</li>
                        <li>✅ Use console.log() for debugging in callbacks</li>
                        <li>✅ Use haptic feedback for user feedback</li>
                        <li>✅ Add delays between consecutive popups (200ms+)</li>
                        <li>✅ Reset state properly after each popup</li>
                    </ul>
                </div>
            </DemoSection>

            <DemoSection title="⚠️ Handling Inline Mode">
                <div className="space-y-3">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                            Inline Mode Alternative
                        </h4>
                        <p className="text-sm mb-3">
                            If inline mode is disabled, use the share URL method instead:
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/yourbotname')}&text=${encodeURIComponent('Check out my score: 1000 points! 🎮')}`
                                    webApp?.openTelegramLink(shareUrl)
                                }}
                                className="btn-secondary w-full text-sm"
                            >
                                Share via URL (Always Works)
                            </button>

                            <button
                                onClick={() => {
                                    webApp?.showAlert(
                                        'To enable inline mode:\n\n' +
                                        '1. Go to @BotFather\n' +
                                        '2. Send /setinline\n' +
                                        '3. Select your bot\n' +
                                        '4. Set placeholder text like "Search..."\n\n' +
                                        'Then inline queries will work!'
                                    )
                                }}
                                className="btn-secondary w-full text-sm"
                            >
                                How to Enable Inline Mode
                            </button>
                        </div>
                    </div>

                    <CodeBlock language="typescript">
                        {`// Always-working share implementation
function shareScore(score) {
  // Method 1: Try inline query (if enabled)
  const useInline = () => {
    // Check if query_id exists first
    if (!webApp?.initDataUnsafe?.query_id) {
      return false
    }
    
    try {
      webApp.switchInlineQuery(
        \`My score: \${score} points!\`,
        ['users', 'groups']
      )
      return true
    } catch (e) {
      return false
    }
  }
  
  // Method 2: Fallback to share URL
  const useShareUrl = () => {
    const text = \`I scored \${score} points! Can you beat me?\`
    const url = 'https://t.me/yourbotname'
    const shareLink = 
      'https://t.me/share/url?' +
      'url=' + encodeURIComponent(url) +
      '&text=' + encodeURIComponent(text)
    
    webApp.openTelegramLink(shareLink)
  }
  
  // Try inline first, fallback to URL
  if (!useInline()) {
    useShareUrl()
  }
}`}
                    </CodeBlock>
                </div>
            </DemoSection>

            <DemoSection title="📋 Common Use Cases">
                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => {
                            safeShowPopup({
                                title: '🏆 Achievement Unlocked!',
                                message: 'Speed Demon\nComplete level in under 30 seconds',
                                buttons: [{ type: 'ok', text: 'Awesome!' }]
                            }, () => {
                                console.log('Achievement acknowledged')
                                webApp?.HapticFeedback.notificationOccurred('success')
                            })
                        }}
                        className="btn-secondary"
                    >
                        Simple Achievement
                    </button>

                    <button
                        onClick={() => {
                            safeShowPopup({
                                title: '💰 Purchase Gems',
                                message: 'Select a package:',
                                buttons: [
                                    { id: 'small', type: 'default', text: '100 💎 - $0.99' },
                                    { id: 'large', type: 'default', text: '500 💎 - $3.99' },
                                    { type: 'cancel' }
                                ]
                            }, (buttonId) => {
                                setTimeout(() => {
                                    setIsPopupOpen(false)
                                    if (buttonId && buttonId !== 'cancel') {
                                        console.log(`Selected package: ${buttonId}`)
                                        webApp?.HapticFeedback.notificationOccurred('success')
                                        // Navigate to payment page instead of showing alert
                                    }
                                }, 100)
                            })
                        }}
                        className="btn-secondary"
                    >
                        In-App Purchase
                    </button>

                    <button
                        onClick={() => {
                            const shareText = 'Join me in this awesome game!'
                            const botUrl = 'https://t.me/yourbotname'
                            webApp?.openTelegramLink(
                                `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`
                            )
                        }}
                        className="btn-secondary"
                    >
                        Direct Share (No Inline Needed)
                    </button>
                </div>
            </DemoSection>
        </div>
    )
}