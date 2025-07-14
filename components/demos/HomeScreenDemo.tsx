// components/demos/HomeScreenDemo.tsx

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

export default function HomeScreenDemo() {
    const { webApp } = useTelegram()
    const [status, setStatus] = useState<string>('checking')
    const [isAdded, setIsAdded] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [hasCheckedOnce, setHasCheckedOnce] = useState(false)

    // Use useCallback to memoize the function with proper dependencies
    const checkStatus = useCallback(() => {
        if (!webApp) {
            console.log('WebApp not available')
            return
        }

        // Prevent multiple simultaneous checks
        if (isChecking) {
            console.log('Already checking status...')
            return
        }

        setIsChecking(true)
        console.log('Checking home screen status...')

        // Set a timeout in case the callback never fires
        const timeoutId = setTimeout(() => {
            console.log('Status check timed out, assuming not added')
            setStatus('not-added')
            setIsChecking(false)
            setHasCheckedOnce(true)
        }, 3000) // 3 second timeout

        try {
            webApp.checkHomeScreenStatus((receivedStatus: string) => {
                clearTimeout(timeoutId)
                console.log('Home screen status received:', receivedStatus)
                setStatus(receivedStatus || 'not-added')
                setIsChecking(false)
                setHasCheckedOnce(true)
            })
        } catch (error) {
            clearTimeout(timeoutId)
            console.error('Error checking status:', error)
            setStatus('not-added')
            setIsChecking(false)
            setHasCheckedOnce(true)
        }
    }, [webApp, isChecking])

    useEffect(() => {
        if (!webApp) return

        const handleHomeScreenAdded = () => {
            setIsAdded(true)
            setStatus('added') // Update status immediately
            webApp.HapticFeedback.notificationOccurred('success')
            webApp.showAlert('Successfully added to home screen!')
        }

        webApp.onEvent('homeScreenAdded', handleHomeScreenAdded)

        // Check initial status after a small delay to ensure WebApp is fully initialized
        const timeoutId = setTimeout(() => {
            checkStatus()
        }, 500)

        return () => {
            webApp.offEvent('homeScreenAdded', handleHomeScreenAdded)
            clearTimeout(timeoutId)
        }
    }, [webApp]) // Remove checkStatus from deps to avoid re-running

    const addToHomeScreen = () => {
        if (!webApp) {
            console.log('WebApp not available')
            return
        }

        // Optimistically update UI
        setStatus('checking')
        webApp.addToHomeScreen()
    }

    const getStatusEmoji = () => {
        switch (status) {
            case 'added': return '✅'
            case 'not-added': return '➕'
            case 'unknown': return '❓'
            case 'checking': return '🔄'
            default: return '❓'
        }
    }

    const getStatusDescription = () => {
        switch (status) {
            case 'added': return 'Mini App is on the home screen'
            case 'not-added': return 'Mini App can be added to home screen'
            case 'unknown': return 'Status cannot be determined'
            case 'checking': return 'Checking status...'
            default: return 'Status unknown'
        }
    }

    // Determine if version supports home screen
    const supportsHomeScreen = webApp?.isVersionAtLeast('7.7') ?? false

    return (
        <div className="space-y-6">
            <DemoSection title="📱 Home Screen Integration">
                <div className="space-y-4">
                    {/* Version check warning */}
                    {webApp && !supportsHomeScreen && (
                        <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                ⚠️ Home screen features require Telegram version 7.7 or higher.
                                Your version: {webApp.version}
                            </p>
                        </div>
                    )}

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Status</span>
                            <span className="text-2xl">{getStatusEmoji()}</span>
                        </div>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            {getStatusDescription()}
                        </p>
                        {status === 'checking' && isChecking && (
                            <p className="text-xs text-[var(--tg-theme-hint-color)] mt-2">
                                This may take a moment...
                            </p>
                        )}
                    </div>

                    <button
                        onClick={checkStatus}
                        className="btn-primary w-full"
                        disabled={isChecking || !supportsHomeScreen}
                    >
                        {isChecking ? 'Checking...' : 'Check Home Screen Status'}
                    </button>

                    <button
                        onClick={addToHomeScreen}
                        className="btn-primary w-full"
                        disabled={status === 'added' || !supportsHomeScreen || isChecking}
                    >
                        {status === 'added' ? 'Already Added' : 'Add to Home Screen'}
                    </button>

                    {/* Info box about the API behavior */}
                    {hasCheckedOnce && status === 'not-added' && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                💡 If the status check isn't working, try adding the app to your home screen
                                and then check the status again. The API works more reliably when the app
                                is already on the home screen.
                            </p>
                        </div>
                    )}

                    {isAdded && (
                        <div className="p-3 bg-green-500/20 rounded text-center">
                            <p className="text-sm font-semibold">🎉 Successfully Added!</p>
                            <p className="text-xs text-[var(--tg-theme-hint-color)] mt-1">
                                You can now launch this Mini App from your home screen
                            </p>
                        </div>
                    )}

                    {/* Debug info */}
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-xs font-mono">
                        <p className="font-bold mb-1">Debug Info:</p>
                        <p>WebApp Available: {webApp ? '✅' : '❌'}</p>
                        <p>Version: {webApp?.version || 'N/A'}</p>
                        <p>Platform: {webApp?.platform || 'N/A'}</p>
                        <p>Supports Home Screen: {supportsHomeScreen ? '✅' : '❌'}</p>
                        <p>Status: {status}</p>
                        <p>Is Checking: {isChecking ? 'Yes' : 'No'}</p>
                        <p>Has Checked Once: {hasCheckedOnce ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Check if app is on home screen
// Note: This API may not respond when app is not on home screen
webApp.checkHomeScreenStatus((status) => {
  // status: 'added' | 'not-added' | 'unknown'
  // May not receive callback if not on home screen
  if (status === 'not-added') {
    showAddToHomePrompt()
  }
})

// Add to home screen
webApp.addToHomeScreen()

// Listen for successful addition
webApp.onEvent('homeScreenAdded', () => {
  console.log('App added to home screen!')
  // Update your UI immediately
  setStatus('added')
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="💡 Implementation Notes">
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">⚠️ API Limitations</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            The <code>checkHomeScreenStatus</code> API may not always respond when the app
                            is not on the home screen. Consider implementing a timeout and assuming "not-added"
                            if no response is received.
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">✅ Best Practices</h4>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] space-y-1 mt-2">
                            <li>• Always listen for the <code>homeScreenAdded</code> event</li>
                            <li>• Implement timeouts for status checks</li>
                            <li>• Provide clear feedback to users</li>
                            <li>• Cache the status locally if needed</li>
                        </ul>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title="🎯 Benefits">
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">🚀 Quick Access</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Launch your Mini App directly without opening Telegram
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">📈 Better Retention</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Users are more likely to return when the app is on their home screen
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">🔔 Push Notifications</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Enable direct notifications without going through Telegram
                        </p>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}