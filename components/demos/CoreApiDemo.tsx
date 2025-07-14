// components/demos/CoreApiDemo.tsx

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
import ColorPicker from '@/components/ColorPicker'

export default function CoreApiDemo() {
    const { webApp } = useTelegram()
    const [clipboardText, setClipboardText] = useState<string | null>(null)
    const [isClosingConfirmationEnabled, setIsClosingConfirmationEnabled] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
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

    // Initialize states and listen for changes
    useEffect(() => {
        if (webApp) {
            // Initialize states
            setIsClosingConfirmationEnabled(webApp.isClosingConfirmationEnabled)
            setIsFullscreen(webApp.isFullscreen)
            setIsExpanded(webApp.isExpanded)

            // Listen for fullscreen changes
            const handleFullscreenChanged = () => {
                setIsFullscreen(webApp.isFullscreen)
            }

            webApp.onEvent('fullscreenChanged', handleFullscreenChanged)

            // Cleanup
            return () => {
                webApp.offEvent('fullscreenChanged', handleFullscreenChanged)
            }
        }
    }, [webApp])

    const toggleClosingConfirmation = () => {
        if (!webApp) return

        if (isClosingConfirmationEnabled) {
            webApp.disableClosingConfirmation()
            setIsClosingConfirmationEnabled(false)
        } else {
            webApp.enableClosingConfirmation()
            setIsClosingConfirmationEnabled(true)
        }
    }

    const toggleFullscreen = () => {
        if (!webApp) return

        if (isFullscreen) {
            webApp.exitFullscreen()
        } else {
            webApp.requestFullscreen()
        }
    }

    const expandApp = () => {
        if (!webApp) return
        webApp.expand()
        setIsExpanded(true)
    }

    const readClipboard = () => {
        // Check if webApp is available
        if (!webApp) {
            console.error('WebApp not available')
            return
        }

        // Check version support
        if (!webApp.isVersionAtLeast('6.9')) {
            webApp.showAlert('Clipboard API requires Telegram version 6.9 or higher. Your version: ' + webApp.version)
            webApp.HapticFeedback.notificationOccurred('error')
            return
        }

        try {
            webApp.readTextFromClipboard((text: string | null) => {
                console.log('Clipboard response:', text)

                // Update state with the clipboard content
                setClipboardText(text === null ? null : text)

                if (text !== null) {
                    // Successfully read clipboard
                    webApp.HapticFeedback.notificationOccurred('success')
                    if (text === '') {
                        webApp.showAlert('Clipboard is empty')
                    } else {
                        webApp.showAlert(`Clipboard content: ${text}`)
                    }
                } else {
                    // Failed to read clipboard
                    webApp.HapticFeedback.notificationOccurred('error')
                    webApp.showAlert('Failed to read clipboard. Please check permissions and try again.')
                }
            })
        } catch (error) {
            console.error('Clipboard read error:', error)
            webApp.HapticFeedback.notificationOccurred('error')
            webApp.showAlert('Clipboard API error. Please try again.')
        }
    }

    const requestWriteAccess = () => {
        webApp?.requestWriteAccess((granted: boolean) => {
            webApp.showAlert(`Write access ${granted ? 'granted' : 'denied'}`)
            webApp.HapticFeedback.notificationOccurred(granted ? 'success' : 'error')
        })
    }

    const requestContact = () => {
        webApp?.requestContact((sent: boolean, event?: any) => {
            webApp.showAlert(`Contact ${sent ? 'sent' : 'cancelled'}`)
            webApp.HapticFeedback.notificationOccurred(sent ? 'success' : 'error')
        })
    }

    const requestVideo = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    // Important: Stop the stream immediately after getting permission
                    stream.getTracks().forEach(track => track.stop());

                    setMediaPermissions(prev => ({ ...prev, video: 'granted' }))
                    webApp?.HapticFeedback.notificationOccurred('success')
                    webApp?.showAlert('Video permission granted')
                })
                .catch((error) => {
                    console.log('Video permission denied:', error.name, error.message)
                    setMediaPermissions(prev => ({ ...prev, video: 'denied' }))
                    webApp?.HapticFeedback.notificationOccurred('error')

                    // Handle different error types
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        webApp?.showAlert('Video permission denied by user')
                    } else if (error.name === 'NotFoundError') {
                        webApp?.showAlert('No video device found')
                    } else {
                        webApp?.showAlert('Video permission denied')
                    }
                })
        } else {
            webApp?.showAlert('Media devices not supported')
        }
    }

    const requestAudio = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    // Important: Stop the stream immediately after getting permission
                    stream.getTracks().forEach(track => track.stop());

                    setMediaPermissions(prev => ({ ...prev, audio: 'granted' }))
                    webApp?.HapticFeedback.notificationOccurred('success')
                    webApp?.showAlert('Audio permission granted')
                })
                .catch((error) => {
                    console.log('Audio permission denied:', error.name, error.message)
                    setMediaPermissions(prev => ({ ...prev, audio: 'denied' }))
                    webApp?.HapticFeedback.notificationOccurred('error')

                    // Handle different error types
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        webApp?.showAlert('Audio permission denied by user')
                    } else if (error.name === 'NotFoundError') {
                        webApp?.showAlert('No audio device found')
                    } else {
                        webApp?.showAlert('Audio permission denied')
                    }
                })
        } else {
            webApp?.showAlert('Media devices not supported')
        }
    }

    const requestAudioVideo = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then((stream) => {
                    // Important: Stop the stream immediately after getting permission
                    stream.getTracks().forEach(track => track.stop());

                    setMediaPermissions(prev => ({ ...prev, audioVideo: 'granted' }))
                    webApp?.HapticFeedback.notificationOccurred('success')
                    webApp?.showAlert('Audio and Video permissions granted')
                })
                .catch((error) => {
                    console.log('Audio/Video permission denied:', error.name, error.message)
                    setMediaPermissions(prev => ({ ...prev, audioVideo: 'denied' }))
                    webApp?.HapticFeedback.notificationOccurred('error')

                    // Handle different error types
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        webApp?.showAlert('Audio and/or Video permissions denied by user')
                    } else if (error.name === 'NotFoundError') {
                        webApp?.showAlert('Audio and/or Video devices not found')
                    } else {
                        webApp?.showAlert('Audio and/or Video permissions denied')
                    }
                })
        } else {
            webApp?.showAlert('Media devices not supported')
        }
    }

    const versions = ['6.0', '6.1', '6.9', '7.0', '7.2', '7.7', '8.0']

    return (
        <div className="space-y-6">
            <DemoSection title="📋 WebApp Information">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Version: <span className="font-semibold">{webApp?.version}</span></div>
                    <div>Platform: <span className="font-semibold">{webApp?.platform}</span></div>
                    <div>Color Scheme: <span className="font-semibold">{webApp?.colorScheme}</span></div>
                    <div>Is Expanded: <span className="font-semibold">{isExpanded ? 'Yes' : 'No'}</span></div>
                    <div>Is Active: <span className="font-semibold">{webApp?.isActive ? 'Yes' : 'No'}</span></div>
                    <div>Is Fullscreen: <span className="font-semibold">{isFullscreen ? 'Yes' : 'No'}</span></div>
                    <div>Closing Confirmation: <span className="font-semibold">{isClosingConfirmationEnabled ? 'Yes' : 'No'}</span></div>
                </div>

                <CodeBlock language="typescript">
                    {`// Access WebApp info
const { webApp } = useTelegram()
console.log(webApp.version)
console.log(webApp.platform)
console.log(webApp.colorScheme)
console.log(webApp.isExpanded)
console.log(webApp.isActive)
console.log(webApp.isFullscreen)
console.log(webApp.isClosingConfirmationEnabled)`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="📐 App Control">
                <div className="space-y-4">
                    <button
                        onClick={expandApp}
                        className="btn-primary w-full"
                        disabled={isExpanded}
                    >
                        {isExpanded ? '✅ Already Expanded' : '📏 Expand WebApp'}
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        className="btn-primary w-full"
                    >
                        {isFullscreen ? '🔳 Exit Fullscreen' : '🔲 Enter Fullscreen'}
                    </button>

                    <button
                        onClick={toggleClosingConfirmation}
                        className="btn-primary w-full"
                    >
                        {isClosingConfirmationEnabled ? '🔓 Disable' : '🔒 Enable'} Closing Confirmation
                    </button>

                    <button
                        onClick={() => webApp?.close()}
                        className="btn-primary w-full bg-red-500"
                    >
                        ❌ Close App (Direct)
                    </button>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold mb-2">📱 Testing Closing Confirmation</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mb-3">
                            The closing confirmation is currently:
                            <span className="font-bold ml-1">{isClosingConfirmationEnabled ? 'Enabled ✅' : 'Disabled ❌'}</span>
                        </p>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mb-2">
                            To test the closing confirmation:
                        </p>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] space-y-1 list-disc list-inside">
                            <li>Try to swipe down from the top of the screen</li>
                            <li>Or press the device's back button</li>
                            <li>Or click the X button in the Mini App header</li>
                        </ul>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mt-3">
                            <strong>Note:</strong> The "Close App" button above calls webApp.close() directly,
                            which bypasses the confirmation dialog.
                        </p>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Expand app to full height
webApp.expand()

// Enter fullscreen mode
webApp.requestFullscreen()

// Exit fullscreen mode
webApp.exitFullscreen()

// Check fullscreen state
if (webApp.isFullscreen) {
  console.log('App is in fullscreen mode')
}

// Enable closing confirmation (for swipe/back button)
webApp.enableClosingConfirmation()

// Disable closing confirmation
webApp.disableClosingConfirmation()

// Check current state
if (webApp.isClosingConfirmationEnabled) {
  console.log('User will see confirmation on swipe/back')
}

// Direct close (no confirmation)
webApp.close()

// Listen for fullscreen changes
webApp.onEvent('fullscreenChanged', () => {
  console.log('Fullscreen:', webApp.isFullscreen)
})

// The confirmation only appears when:
// - User swipes down
// - User presses back button
// - User clicks X in header`}
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

                                    // Update color pickers with actual theme colors
                                    setCustomColors({
                                        header: webApp?.themeParams.secondary_bg_color || '#f0f0f0',
                                        background: webApp?.themeParams.bg_color || '#ffffff',
                                        bottomBar: webApp?.themeParams.secondary_bg_color || '#f0f0f0'
                                    })
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
                        <button
                            onClick={readClipboard}
                            className="btn-primary"
                            disabled={!webApp?.isVersionAtLeast('6.9')}
                        >
                            Read Clipboard
                        </button>
                        <button onClick={requestWriteAccess} className="btn-primary">
                            Write Access
                        </button>
                    </div>

                    {!webApp?.isVersionAtLeast('6.9') && (
                        <div className="p-2 bg-yellow-500/20 rounded text-xs text-center">
                            Clipboard API requires version 6.9+
                        </div>
                    )}

                    {clipboardText !== null && (
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="font-semibold text-sm mb-1">Clipboard Content:</div>
                            <div className="font-mono text-sm break-all">
                                {clipboardText === '' ? '(clipboard is empty)' : clipboardText}
                            </div>
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

            <DemoSection title="🔍 Version Check">
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <h4 className="font-semibold mb-3">Current Version: {webApp?.version}</h4>
                        <div className="space-y-2">
                            {versions.map(version => {
                                const isSupported = webApp?.isVersionAtLeast(version) || false
                                return (
                                    <div key={version} className="flex items-center justify-between text-sm">
                                        <span>Version {version}</span>
                                        <span className={`font-semibold ${isSupported ? 'text-green-500' : 'text-red-500'}`}>
                                            {isSupported ? '✅ Supported' : '❌ Not Supported'}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                            Version Features Guide
                        </h4>
                        <ul className="text-sm space-y-1">
                            <li>• v6.0: Basic Mini App features</li>
                            <li>• v6.1: Cloud Storage, Haptic Feedback</li>
                            <li>• v6.9: QR Scanner, Clipboard API</li>
                            <li>• v7.0: Biometrics, Story Sharing</li>
                            <li>• v7.2: Secondary Button, Swipe Control</li>
                            <li>• v7.7: Home Screen, Emoji Status</li>
                            <li>• v8.0: Accelerometer, Gyroscope, Location</li>
                        </ul>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Check version support before using features
if (webApp.isVersionAtLeast('7.0')) {
  // Safe to use biometrics
  webApp.BiometricManager.init()
}

if (webApp.isVersionAtLeast('6.9')) {
  // Safe to use QR scanner
  webApp.showScanQrPopup(...)
}

if (webApp.isVersionAtLeast('8.0')) {
  // Safe to use sensors
  webApp.Accelerometer.start()
  webApp.Gyroscope.start()
}

// Always check version for new features
const canUseBiometrics = webApp.isVersionAtLeast('7.0')
const canUseLocation = webApp.isVersionAtLeast('8.0')`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}