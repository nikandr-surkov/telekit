// components/demos/BiometricsDemo.tsx

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function BiometricsDemo() {
    const { webApp } = useTelegram()
    const [biometricInfo, setBiometricInfo] = useState({
        isInited: false,
        isAvailable: false,
        type: '',
        isAccessRequested: false,
        isAccessGranted: false,
        isTokenSaved: false,
        deviceId: ''
    })
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [showExplanation, setShowExplanation] = useState(true)

    const updateBiometricInfo = useCallback(() => {
        if (!webApp?.BiometricManager) return

        const bm = webApp.BiometricManager
        setBiometricInfo({
            isInited: bm.isInited,
            isAvailable: bm.isBiometricAvailable,
            type: bm.biometricType,
            isAccessRequested: bm.isAccessRequested,
            isAccessGranted: bm.isAccessGranted,
            isTokenSaved: bm.isBiometricTokenSaved,
            deviceId: bm.deviceId
        })
    }, [webApp])

    useEffect(() => {
        if (!webApp) return

        // Listen for biometric manager updates
        webApp.onEvent('biometricManagerUpdated', updateBiometricInfo)

        // Listen for app activation to check permission changes
        const handleActivated = () => {
            // Re-init and update when app becomes active
            if (webApp.BiometricManager) {
                webApp.BiometricManager.init(() => {
                    updateBiometricInfo()
                })
            }
        }

        webApp.onEvent('activated', handleActivated)

        // Only init if webApp is available
        if (webApp.BiometricManager) {
            webApp.BiometricManager.init()
            updateBiometricInfo() // Call it once after init
        }

        // Set up periodic check when app is active
        const intervalId = setInterval(() => {
            if (webApp.isActive) {
                updateBiometricInfo()
            }
        }, 1000) // Check every second while active

        return () => {
            webApp.offEvent('biometricManagerUpdated', updateBiometricInfo)
            webApp.offEvent('activated', handleActivated)
            clearInterval(intervalId)
        }
    }, [webApp, updateBiometricInfo])

    const requestAccess = () => {
        webApp?.BiometricManager.requestAccess(
            { reason: 'To secure your game progress and purchases' },
            (granted: boolean) => {
                webApp.showAlert(`Biometric access ${granted ? 'granted' : 'denied'}`)
                // Force update after callback
                setTimeout(updateBiometricInfo, 100)
            }
        )
    }

    const authenticate = () => {
        // First, let's check if permissions are still valid
        updateBiometricInfo()

        // Small delay to ensure state is updated
        setTimeout(() => {
            if (!biometricInfo.isAccessGranted) {
                webApp?.HapticFeedback.notificationOccurred('error')
                webApp?.showAlert('Biometric access has been revoked. Please grant access again.')
                return
            }

            webApp?.BiometricManager.authenticate(
                { reason: 'Verify your identity to continue' },
                (success: boolean, token?: string) => {
                    if (success && token) {
                        setAuthToken(token)
                        webApp.HapticFeedback.notificationOccurred('success')
                        webApp.showAlert('Authentication successful!')
                    } else {
                        webApp.HapticFeedback.notificationOccurred('error')
                        // Update info in case permissions changed
                        updateBiometricInfo()

                        if (!biometricInfo.isTokenSaved) {
                            webApp.showAlert('Authentication failed. Make sure you have a token saved.')
                        } else {
                            webApp.showAlert('Authentication failed. Please try again.')
                        }
                    }
                }
            )
        }, 100)
    }

    const saveToken = () => {
        // Check permissions before saving
        updateBiometricInfo()

        setTimeout(() => {
            if (!biometricInfo.isAccessGranted) {
                webApp?.HapticFeedback.notificationOccurred('error')
                webApp?.showAlert('Biometric access has been revoked. Please grant access again.')
                return
            }

            const token = Math.random().toString(36).substring(7)
            webApp?.BiometricManager.updateBiometricToken(token, (updated: boolean) => {
                if (updated) {
                    webApp.showAlert('Token saved securely! You can now authenticate.')
                    // Force update the UI
                    setTimeout(updateBiometricInfo, 100)
                } else {
                    // Token save failed - possibly permissions revoked
                    updateBiometricInfo()
                    webApp.HapticFeedback.notificationOccurred('error')
                    webApp.showAlert('Failed to save token. Please check biometric permissions.')
                }
            })
        }, 100)
    }

    const removeToken = () => {
        webApp?.BiometricManager.updateBiometricToken('', (updated: boolean) => {
            if (updated) {
                webApp.showAlert('Token removed')
                setAuthToken(null) // Clear the auth token when removing saved token
                // Force update the UI
                setTimeout(updateBiometricInfo, 100)
            }
        })
    }

    // Add manual refresh button
    const refreshStatus = () => {
        if (webApp?.BiometricManager) {
            webApp.BiometricManager.init(() => {
                updateBiometricInfo()
                webApp.HapticFeedback.notificationOccurred('success')
                webApp.showAlert('Status refreshed')
            })
        }
    }

    return (
        <div className="space-y-6">
            {showExplanation && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                🔐 How Biometrics Work in Telegram
                            </h3>
                            <ol className="text-sm space-y-2 text-[var(--tg-theme-text-color)]">
                                <li><strong>1. Request Access:</strong> Ask user permission to use biometrics</li>
                                <li><strong>2. Save Token:</strong> Store a secure token that will be used for authentication</li>
                                <li><strong>3. Authenticate:</strong> Verify user's identity against the saved token</li>
                                <li className="text-xs text-[var(--tg-theme-hint-color)] mt-2">
                                    💡 Your biometric data never leaves your device - only secure tokens are used
                                </li>
                                <li className="text-xs text-[var(--tg-theme-hint-color)]">
                                    ⚠️ Important: You must save a token BEFORE you can authenticate!
                                </li>
                            </ol>
                        </div>
                        <button
                            onClick={() => setShowExplanation(false)}
                            className="ml-2 text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)]"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <DemoSection title="🔐 Biometric Status">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="font-semibold mb-1">System Status</div>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-[var(--tg-theme-hint-color)]">Initialized:</span>
                                    <span>{biometricInfo.isInited ? '✅' : '❌'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--tg-theme-hint-color)]">Available:</span>
                                    <span>{biometricInfo.isAvailable ? '✅' : '❌'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--tg-theme-hint-color)]">Type:</span>
                                    <span>{biometricInfo.type === 'face' ? '👤 Face' : biometricInfo.type === 'finger' ? '👆 Finger' : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="font-semibold mb-1">User Permissions</div>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-[var(--tg-theme-hint-color)]">Requested:</span>
                                    <span>{biometricInfo.isAccessRequested ? '✅' : '❌'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--tg-theme-hint-color)]">Granted:</span>
                                    <span>{biometricInfo.isAccessGranted ? '✅' : '❌'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--tg-theme-hint-color)]">Token Saved:</span>
                                    <span>{biometricInfo.isTokenSaved ? '✅' : '❌'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-[var(--tg-theme-hint-color)] break-all flex-1">
                            Device ID: {biometricInfo.deviceId || 'N/A'}
                        </div>
                        <button
                            onClick={refreshStatus}
                            className="btn-secondary text-xs px-3 py-1"
                            title="Refresh biometric status"
                        >
                            🔄 Refresh
                        </button>
                    </div>

                    {/* Show settings button only when access was requested but denied */}
                    {biometricInfo.isAccessRequested && !biometricInfo.isAccessGranted && (
                        <button
                            onClick={() => webApp?.BiometricManager.openSettings()}
                            className="btn-secondary w-full"
                        >
                            ⚙️ Open Settings
                        </button>
                    )}

                    {/* Show warning if permissions were revoked */}
                    {biometricInfo.isAccessRequested && !biometricInfo.isAccessGranted && biometricInfo.isTokenSaved && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                ⚠️ Biometric access was revoked. Your saved token is still present but cannot be used until you grant access again.
                            </p>
                        </div>
                    )}
                </div>
            </DemoSection>

            <DemoSection title="🔑 Biometric Actions">
                <div className="space-y-4">
                    {/* Step 1: Request Access */}
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Step 1: Request Permission</h4>
                            {biometricInfo.isAccessGranted && <span className="text-green-500">✅ Completed</span>}
                        </div>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mb-3">
                            First, ask the user for permission to use biometric authentication
                        </p>
                        <button
                            onClick={requestAccess}
                            className="btn-primary w-full"
                            disabled={biometricInfo.isAccessGranted}
                        >
                            {biometricInfo.isAccessGranted ? '✅ Access Already Granted' : 'Request Biometric Access'}
                        </button>
                    </div>

                    {/* Step 2: Save Token */}
                    <div className={`p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg ${!biometricInfo.isAccessGranted ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Step 2: Save Authentication Token</h4>
                            {biometricInfo.isTokenSaved && <span className="text-green-500">✅ Completed</span>}
                        </div>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mb-3">
                            You must save a token first before you can authenticate. This token will be used to verify your identity.
                        </p>

                        {!biometricInfo.isTokenSaved && biometricInfo.isAccessGranted && (
                            <div className="p-3 mb-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                    ⚠️ No token saved yet. Save a token first to enable authentication.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={saveToken}
                                className="btn-primary"
                                disabled={!biometricInfo.isAccessGranted || biometricInfo.isTokenSaved}
                            >
                                {biometricInfo.isTokenSaved ? '✅ Token Saved' : '💾 Save Token'}
                            </button>

                            <button
                                onClick={removeToken}
                                className="btn-primary"
                                disabled={!biometricInfo.isTokenSaved}
                            >
                                🗑️ Remove Token
                            </button>
                        </div>

                        {biometricInfo.isTokenSaved && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                ✅ Token saved! You can now authenticate using your biometrics.
                            </p>
                        )}
                    </div>

                    {/* Step 3: Authenticate */}
                    <div className={`p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg ${!biometricInfo.isTokenSaved ? 'opacity-50' : ''}`}>
                        <h4 className="font-semibold mb-2">Step 3: Authenticate with Biometrics</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mb-3">
                            Now verify your identity using your saved biometric token
                        </p>

                        {!biometricInfo.isTokenSaved && biometricInfo.isAccessGranted && (
                            <div className="p-3 mb-3 bg-red-500/10 border border-red-500/30 rounded">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    ❌ Cannot authenticate without a saved token. Complete Step 2 first.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={authenticate}
                            className="btn-primary w-full"
                            disabled={!biometricInfo.isAccessGranted || !biometricInfo.isTokenSaved}
                        >
                            {!biometricInfo.isAccessGranted ? '🔒 Grant Access First' :
                                !biometricInfo.isTokenSaved ? '💾 Save Token First' :
                                    '👆 Authenticate with Biometrics'}
                        </button>

                        {authToken && (
                            <div className="mt-3 p-3 bg-green-500/20 rounded text-sm">
                                <div className="font-semibold">✅ Authentication Successful!</div>
                                <div className="text-xs mt-1 break-all">Token: {authToken}</div>
                                <p className="text-xs mt-2 text-[var(--tg-theme-hint-color)]">
                                    This token can be used to verify the user on your backend
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Settings Button for denied access - as a separate warning */}
                    {biometricInfo.isAccessRequested && !biometricInfo.isAccessGranted && (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                                ⚠️ Biometric Access Denied
                            </h4>
                            <p className="text-sm mb-3">
                                You previously denied biometric access. To enable biometrics, you need to grant permission in your device settings.
                            </p>
                            <button
                                onClick={() => webApp?.BiometricManager.openSettings()}
                                className="btn-secondary w-full"
                            >
                                ⚙️ Open Device Settings
                            </button>
                        </div>
                    )}
                </div>

                <CodeBlock language="typescript">
                    {`// Complete biometric flow with permission monitoring

// 1. Initialize and monitor permissions
webApp.BiometricManager.init()

// Listen for app activation to check permission changes
webApp.onEvent('activated', () => {
    // Re-check biometric status when app becomes active
    webApp.BiometricManager.init(() => {
        checkBiometricStatus()
    })
})

// 2. Request permission (only needed once)
webApp.BiometricManager.requestAccess({
    reason: 'To secure your account'
}, (granted) => {
    if (granted) {
        // Permission granted, now save a token
        saveSecureToken()
    }
})

// 3. Save token with permission check
function saveSecureToken() {
    // Always check permissions before sensitive operations
    if (!webApp.BiometricManager.isAccessGranted) {
        showPermissionRevokedWarning()
        return
    }
    
    const secureToken = generateSecureToken()
    webApp.BiometricManager.updateBiometricToken(
        secureToken,
        (saved) => {
            if (saved) {
                console.log('Token saved successfully')
            } else {
                // Save failed - permissions might have been revoked
                checkBiometricStatus()
            }
        }
    )
}

// 4. Authenticate with permission fallback
function authenticateUser() {
    webApp.BiometricManager.authenticate({
        reason: 'Confirm your identity'
    }, (success, token) => {
        if (success && token) {
            verifyWithBackend(token)
        } else {
            // Check if permissions were revoked
            if (!webApp.BiometricManager.isAccessGranted) {
                showPermissionRevokedDialog()
            }
        }
    })
}

// 5. Handle permission revocation gracefully
function showPermissionRevokedDialog() {
    webApp.showPopup({
        title: 'Biometric Access Required',
        message: 'Biometric permissions have been revoked. Would you like to re-enable them?',
        buttons: [
            { id: 'settings', text: 'Open Settings' },
            { type: 'cancel' }
        ]
    }, (buttonId) => {
        if (buttonId === 'settings') {
            webApp.BiometricManager.openSettings()
        }
    })
}`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="💡 Understanding the Flow">
                <div className="space-y-3">
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold mb-2">Why Save Token First?</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            The biometric authentication in Telegram works by comparing your biometric input
                            against a saved token. Without a saved token, there's nothing to authenticate against!
                        </p>
                        <div className="mt-3 p-3 bg-[var(--tg-theme-bg-color)] rounded">
                            <p className="text-xs font-mono">
                                Saved Token + Biometric Input = Authentication Success ✅
                            </p>
                            <p className="text-xs font-mono mt-1">
                                No Token + Biometric Input = Authentication Failure ❌
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold mb-2">Handling Permission Changes</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mb-3">
                            Users can revoke biometric permissions at any time through system settings. Your app should:
                        </p>
                        <ol className="text-sm text-[var(--tg-theme-hint-color)] space-y-1 list-decimal list-inside">
                            <li>Check permissions when the app becomes active</li>
                            <li>Handle authentication failures gracefully</li>
                            <li>Provide clear instructions to re-enable permissions</li>
                            <li>Keep saved tokens (they'll work once permissions are restored)</li>
                        </ol>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
                        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                            Best Practice: Backend Integration
                        </h4>
                        <p className="text-sm">
                            Always generate tokens on your backend and verify them after authentication.
                            This ensures the biometric flow is secure and integrated with your auth system.
                        </p>
                    </div>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold mb-2">When Can You Open Settings?</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            The <code className="px-1 py-0.5 bg-[var(--tg-theme-bg-color)] rounded text-xs">openSettings()</code> method
                            only works when biometric access has been requested but denied. This opens the system settings
                            where users can manually enable biometric permissions for Telegram.
                        </p>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}