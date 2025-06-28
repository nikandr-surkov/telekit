// components/demos/CoreApiDemo.tsx
'use client'

import { useState } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'
import ColorPicker from '@/components/ColorPicker'

export default function CoreApiDemo() {
    const { webApp } = useTelegram()
    const [clipboardText, setClipboardText] = useState<string | null>(null)
    const [mediaPermissions, setMediaPermissions] = useState({
        video: '',
        audio: '',
        audioVideo: ''
    })

    // Add color states
    const [customColors, setCustomColors] = useState({
        header: webApp?.headerColor || '#000000',
        background: webApp?.backgroundColor || '#ffffff',
        bottomBar: webApp?.bottomBarColor || '#000000'
    })

    const readClipboard = () => {
        webApp?.readTextFromClipboard((text: string | null) => {
            setClipboardText(text)
            webApp.HapticFeedback.notificationOccurred(text ? 'success' : 'error')
        })
    }

    const requestWriteAccess = () => {
        webApp?.requestWriteAccess((granted: boolean) => {
            webApp.showAlert(`Write access ${granted ? 'granted' : 'denied'}`)
        })
    }

    const requestContact = () => {
        webApp?.requestContact((sent: boolean, event?: any) => {
            webApp.showAlert(`Contact ${sent ? 'sent' : 'cancelled'}`)
        })
    }

    const requestVideo = () => {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(() => {
                    setMediaPermissions(prev => ({ ...prev, video: 'granted' }))
                    webApp?.HapticFeedback.notificationOccurred('success')
                })
                .catch(() => {
                    setMediaPermissions(prev => ({ ...prev, video: 'denied' }))
                    webApp?.HapticFeedback.notificationOccurred('error')
                })
        } else {
            webApp?.showAlert('Media devices not supported')
        }
    }

    const requestAudio = () => {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    setMediaPermissions(prev => ({ ...prev, audio: 'granted' }))
                    webApp?.HapticFeedback.notificationOccurred('success')
                })
                .catch(() => {
                    setMediaPermissions(prev => ({ ...prev, audio: 'denied' }))
                    webApp?.HapticFeedback.notificationOccurred('error')
                })
        } else {
            webApp?.showAlert('Media devices not supported')
        }
    }

    const requestAudioVideo = () => {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(() => {
                    setMediaPermissions(prev => ({ ...prev, audioVideo: 'granted' }))
                    webApp?.HapticFeedback.notificationOccurred('success')
                })
                .catch(() => {
                    setMediaPermissions(prev => ({ ...prev, audioVideo: 'denied' }))
                    webApp?.HapticFeedback.notificationOccurred('error')
                })
        } else {
            webApp?.showAlert('Media devices not supported')
        }
    }

    return (
        <div className="space-y-6">
            <DemoSection title="📋 WebApp Information">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Version: <span className="font-semibold">{webApp?.version}</span></div>
                    <div>Platform: <span className="font-semibold">{webApp?.platform}</span></div>
                    <div>Color Scheme: <span className="font-semibold">{webApp?.colorScheme}</span></div>
                    <div>Is Expanded: <span className="font-semibold">{webApp?.isExpanded ? 'Yes' : 'No'}</span></div>
                    <div>Is Active: <span className="font-semibold">{webApp?.isActive ? 'Yes' : 'No'}</span></div>
                    <div>Is Fullscreen: <span className="font-semibold">{webApp?.isFullscreen ? 'Yes' : 'No'}</span></div>
                </div>

                <CodeBlock language="typescript">
                    {`// Access WebApp info
const { webApp } = useTelegram()
console.log(webApp.version)
console.log(webApp.platform)
console.log(webApp.colorScheme)
console.log(webApp.isExpanded)
console.log(webApp.isActive)`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🎨 Theme Management">
                <div className="space-y-4">
                    {/* Color Picker Section */}
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg space-y-4">
                        <h4 className="font-semibold">Custom Color Picker</h4>

                        <ColorPicker
                            label="Header Color"
                            value={customColors.header}
                            presets={[
                                { label: 'Default (bg_color)', value: 'bg_color' },
                                { label: 'Secondary', value: 'secondary_bg_color' },
                            ]}
                            onChange={(color) => {
                                setCustomColors(prev => ({ ...prev, header: color }))
                                webApp?.setHeaderColor(color)
                            }}
                        />

                        <ColorPicker
                            label="Background Color"
                            value={customColors.background}
                            presets={[
                                { label: 'Default (bg_color)', value: 'bg_color' },
                                { label: 'Secondary', value: 'secondary_bg_color' },
                            ]}
                            onChange={(color) => {
                                setCustomColors(prev => ({ ...prev, background: color }))
                                webApp?.setBackgroundColor(color)
                            }}
                        />

                        <ColorPicker
                            label="Bottom Bar Color"
                            value={customColors.bottomBar}
                            presets={[
                                { label: 'Default (bg_color)', value: 'bg_color' },
                                { label: 'Secondary', value: 'secondary_bg_color' },
                                { label: 'Bottom Bar', value: 'bottom_bar_bg_color' },
                            ]}
                            onChange={(color) => {
                                setCustomColors(prev => ({ ...prev, bottomBar: color }))
                                webApp?.setBottomBarColor(color)
                            }}
                        />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Quick Presets</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => {
                                    webApp?.setHeaderColor('secondary_bg_color')
                                    webApp?.setBackgroundColor('bg_color')
                                    webApp?.setBottomBarColor('secondary_bg_color')
                                }}
                                className="btn-primary"
                            >
                                Default Theme
                            </button>
                            <button
                                onClick={() => {
                                    webApp?.setHeaderColor('#1a1a1a')
                                    webApp?.setBackgroundColor('#000000')
                                    webApp?.setBottomBarColor('#1a1a1a')
                                    setCustomColors({
                                        header: '#1a1a1a',
                                        background: '#000000',
                                        bottomBar: '#1a1a1a'
                                    })
                                }}
                                className="btn-primary"
                            >
                                Dark Theme
                            </button>
                            <button
                                onClick={() => {
                                    webApp?.setHeaderColor('#4CAF50')
                                    webApp?.setBackgroundColor('#E8F5E9')
                                    webApp?.setBottomBarColor('#4CAF50')
                                    setCustomColors({
                                        header: '#4CAF50',
                                        background: '#E8F5E9',
                                        bottomBar: '#4CAF50'
                                    })
                                }}
                                className="btn-primary"
                            >
                                Green Theme
                            </button>
                            <button
                                onClick={() => {
                                    webApp?.setHeaderColor('#2196F3')
                                    webApp?.setBackgroundColor('#E3F2FD')
                                    webApp?.setBottomBarColor('#2196F3')
                                    setCustomColors({
                                        header: '#2196F3',
                                        background: '#E3F2FD',
                                        bottomBar: '#2196F3'
                                    })
                                }}
                                className="btn-primary"
                            >
                                Blue Theme
                            </button>
                        </div>
                    </div>

                    {/* Current Theme Values */}
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-sm space-y-1">
                        <div className="font-semibold mb-2">Current Theme Values:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>bg_color: <span className="font-mono">{webApp?.themeParams.bg_color}</span></div>
                            <div>text_color: <span className="font-mono">{webApp?.themeParams.text_color}</span></div>
                            <div>hint_color: <span className="font-mono">{webApp?.themeParams.hint_color}</span></div>
                            <div>link_color: <span className="font-mono">{webApp?.themeParams.link_color}</span></div>
                            <div>button_color: <span className="font-mono">{webApp?.themeParams.button_color}</span></div>
                            <div>button_text_color: <span className="font-mono">{webApp?.themeParams.button_text_color}</span></div>
                        </div>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Theme customization
webApp.setHeaderColor('#4CAF50')
webApp.setBackgroundColor('#E8F5E9')
webApp.setBottomBarColor('#4CAF50')

// Use theme variables
webApp.setHeaderColor('secondary_bg_color')
webApp.setBackgroundColor('bg_color')

// Access theme parameters
const theme = webApp.themeParams
console.log(theme.bg_color)
console.log(theme.button_color)`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🔐 Permissions">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={readClipboard} className="btn-primary">
                            Read Clipboard
                        </button>
                        <button onClick={requestWriteAccess} className="btn-primary">
                            Write Access
                        </button>
                    </div>

                    {clipboardText !== null && (
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-sm">
                            Clipboard: {clipboardText || '(empty)'}
                        </div>
                    )}

                    <button onClick={requestContact} className="btn-primary w-full">
                        Request Contact
                    </button>

                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold mb-3">Media Permissions</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={requestVideo} className="btn-primary">
                                📹 Video
                            </button>
                            <button onClick={requestAudio} className="btn-primary">
                                🎤 Audio
                            </button>
                            <button onClick={requestAudioVideo} className="btn-primary">
                                📹+🎤 Both
                            </button>
                        </div>

                        {(mediaPermissions.video || mediaPermissions.audio || mediaPermissions.audioVideo) && (
                            <div className="mt-3 space-y-1 text-sm">
                                {mediaPermissions.video && (
                                    <div>Video: <span className={mediaPermissions.video === 'granted' ? 'text-green-500' : 'text-red-500'}>
                                        {mediaPermissions.video}
                                    </span></div>
                                )}
                                {mediaPermissions.audio && (
                                    <div>Audio: <span className={mediaPermissions.audio === 'granted' ? 'text-green-500' : 'text-red-500'}>
                                        {mediaPermissions.audio}
                                    </span></div>
                                )}
                                {mediaPermissions.audioVideo && (
                                    <div>Audio+Video: <span className={mediaPermissions.audioVideo === 'granted' ? 'text-green-500' : 'text-red-500'}>
                                        {mediaPermissions.audioVideo}
                                    </span></div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Request permissions
webApp.readTextFromClipboard((text) => {
  console.log('Clipboard text:', text)
})

webApp.requestWriteAccess((granted) => {
  if (granted) {
    // Can now write to messages
  }
})

webApp.requestContact((sent) => {
  if (sent) {
    // Contact shared with bot
  }
})

// Media permissions
navigator.mediaDevices.getUserMedia({ 
  video: true,
  audio: true 
}).then((stream) => {
  // Access granted
}).catch((err) => {
  // Access denied
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🚀 Navigation & Links">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => webApp?.openLink('https://telegram.org')}
                            className="btn-primary"
                        >
                            Open External Link
                        </button>
                        <button
                            onClick={() => webApp?.openTelegramLink('https://t.me/telegram')}
                            className="btn-primary"
                        >
                            Open Telegram Link
                        </button>
                    </div>

                    <button
                        onClick={() => webApp?.openLink('https://telegra.ph/api', { try_instant_view: true })}
                        className="btn-primary w-full"
                    >
                        Open with Instant View
                    </button>

                    <button
                        onClick={() => webApp?.shareToStory('https://telegra.ph/file/5583ac37c90979f052b7b.png', {
                            text: 'Check out my game score! 🎮',
                            widget_link: {
                                url: 'https://t.me/yourgamebot',
                                name: 'Play Now'
                            }
                        })}
                        className="btn-primary w-full"
                    >
                        Share to Story
                    </button>

                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold mb-3">Browser Options</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => webApp?.openLink('https://telegram.org', { try_browser: 'chrome' })}
                                className="btn-secondary text-sm"
                            >
                                Open in Chrome
                            </button>
                            <button
                                onClick={() => webApp?.openLink('https://telegram.org', { try_browser: 'safari' })}
                                className="btn-secondary text-sm"
                            >
                                Open in Safari
                            </button>
                        </div>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Navigation examples
webApp.openLink('https://example.com')
webApp.openTelegramLink('https://t.me/botname')

// Open with Instant View
webApp.openLink('https://telegra.ph/api', {
  try_instant_view: true
})

// Open in specific browser
webApp.openLink('https://example.com', {
  try_browser: 'chrome' // or 'safari', 'firefox', 'opera'
})

// Share to story
webApp.shareToStory(imageUrl, {
  text: 'My high score: 1000!',
  widget_link: {
    url: 'https://t.me/yourgamebot',
    name: 'Play Now'
  }
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🔧 Utility Functions">
                <div className="space-y-4">
                    <button
                        onClick={() => webApp?.expand()}
                        className="btn-primary"
                        disabled={webApp?.isExpanded}
                    >
                        Expand WebApp
                    </button>

                    <button
                        onClick={() => {
                            webApp?.showAlert('This is an alert message!')
                        }}
                        className="btn-primary"
                    >
                        Show Alert
                    </button>

                    <button
                        onClick={() => {
                            webApp?.showConfirm('Are you sure you want to continue?', (confirmed) => {
                                webApp.showAlert(confirmed ? 'Confirmed!' : 'Cancelled')
                            })
                        }}
                        className="btn-primary"
                    >
                        Show Confirm
                    </button>

                    <button
                        onClick={() => {
                            const version = '7.0'
                            const isSupported = webApp?.isVersionAtLeast(version)
                            webApp?.showAlert(`Version ${version} ${isSupported ? 'is' : 'is not'} supported`)
                        }}
                        className="btn-primary"
                    >
                        Check Version Support
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Utility functions
webApp.expand() // Expand to full height
webApp.close() // Close Web App

// Alerts
webApp.showAlert('Hello!')
webApp.showConfirm('Continue?', (confirmed) => {
  if (confirmed) {
    // User clicked OK
  }
})

// Version check
if (webApp.isVersionAtLeast('6.9')) {
  // Use newer features
}`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}