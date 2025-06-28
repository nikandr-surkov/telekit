// components/demos/BiometricsDemo.tsx
'use client'

import { useState, useEffect } from 'react'
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

    useEffect(() => {
        if (!webApp) return

        const updateBiometricInfo = () => {
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
        }

        webApp.onEvent('biometricManagerUpdated', updateBiometricInfo)

        // Only init if webApp is available
        if (webApp.BiometricManager) {
            webApp.BiometricManager.init()
            updateBiometricInfo() // Call it once after init
        }

        return () => {
            webApp.offEvent('biometricManagerUpdated', updateBiometricInfo)
        }
    }, [webApp])

    const requestAccess = () => {
        webApp?.BiometricManager.requestAccess(
            { reason: 'To secure your game progress and purchases' },
            (granted: boolean) => {
                webApp.showAlert(`Biometric access ${granted ? 'granted' : 'denied'}`)
            }
        )
    }

    const authenticate = () => {
        webApp?.BiometricManager.authenticate(
            { reason: 'Verify your identity to continue' },
            (success: boolean, token?: string) => {
                if (success && token) {
                    setAuthToken(token)
                    webApp.HapticFeedback.notificationOccurred('success')
                    webApp.showAlert('Authentication successful!')
                } else {
                    webApp.HapticFeedback.notificationOccurred('error')
                    webApp.showAlert('Authentication failed')
                }
            }
        )
    }

    const saveToken = () => {
        const token = Math.random().toString(36).substring(7)
        webApp?.BiometricManager.updateBiometricToken(token, (updated: boolean) => {
            if (updated) {
                webApp.showAlert('Token saved securely')
            }
        })
    }

    const removeToken = () => {
        webApp?.BiometricManager.updateBiometricToken('', (updated: boolean) => {
            if (updated) {
                webApp.showAlert('Token removed')
            }
        })
    }

    return (
        <div className="space-y-6">
            <DemoSection title="🔐 Biometric Status">
                <div className="space-y-2 text-sm">
                    <div>Initialized: {biometricInfo.isInited ? '✅' : '❌'}</div>
                    <div>Available: {biometricInfo.isAvailable ? '✅' : '❌'}</div>
                    <div>Type: {biometricInfo.type || 'N/A'}</div>
                    <div>Access Requested: {biometricInfo.isAccessRequested ? '✅' : '❌'}</div>
                    <div>Access Granted: {biometricInfo.isAccessGranted ? '✅' : '❌'}</div>
                    <div>Token Saved: {biometricInfo.isTokenSaved ? '✅' : '❌'}</div>
                    <div className="text-xs text-[var(--tg-theme-hint-color)]">
                        Device ID: {biometricInfo.deviceId || 'N/A'}
                    </div>
                </div>
            </DemoSection>

            <DemoSection title="🔑 Biometric Actions">
                <div className="space-y-4">
                    <button
                        onClick={requestAccess}
                        className="btn-primary w-full"
                        disabled={biometricInfo.isAccessGranted}
                    >
                        Request Biometric Access
                    </button>

                    <button
                        onClick={authenticate}
                        className="btn-primary w-full"
                        disabled={!biometricInfo.isAccessGranted}
                    >
                        Authenticate
                    </button>

                    {authToken && (
                        <div className="p-3 bg-green-500/20 rounded text-sm">
                            Auth Token: {authToken}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={saveToken}
                            className="btn-primary"
                            disabled={!biometricInfo.isAccessGranted}
                        >
                            Save Token
                        </button>

                        <button
                            onClick={removeToken}
                            className="btn-primary"
                            disabled={!biometricInfo.isTokenSaved}
                        >
                            Remove Token
                        </button>
                    </div>

                    {biometricInfo.isAccessRequested && !biometricInfo.isAccessGranted && (
                        <button
                            onClick={() => webApp?.BiometricManager.openSettings()}
                            className="btn-secondary w-full"
                        >
                            Open Settings
                        </button>
                    )}
                </div>

                <CodeBlock language="typescript">
                    {`// Initialize biometrics
webApp.BiometricManager.init()

// Request access
webApp.BiometricManager.requestAccess({
 reason: 'To secure your game account'
}, (granted) => {
 if (granted) {
   enableBiometricFeatures()
 }
})

// Authenticate user
webApp.BiometricManager.authenticate({
 reason: 'Confirm purchase'
}, (success, token) => {
 if (success && token) {
   // User authenticated
   processPurchase(token)
 }
})

// Save secure token
const userToken = generateUserToken()
webApp.BiometricManager.updateBiometricToken(
 userToken,
 (updated) => {
   if (updated) {
     // Token saved securely
   }
 }
)`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="💡 Use Cases">
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Secure Purchases</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Require biometric auth before in-app purchases
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Account Protection</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Lock sensitive game features behind biometrics
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Quick Login</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Save auth token for passwordless access
                        </p>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}