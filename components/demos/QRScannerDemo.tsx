// components/demos/QRScannerDemo.tsx

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

'use client'

import { useState } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'
import QRCode from 'react-qr-code'

export default function QRScannerDemo() {
    const { webApp } = useTelegram()
    const [scanHistory, setScanHistory] = useState<Array<{
        text: string
        timestamp: Date
        type: string
    }>>([])

    const scanQRCode = () => {
        webApp?.showScanQrPopup(
            { text: 'Scan any QR code' },
            (text: string) => {
                // Detect QR code type
                const type = detectQRType(text)

                // Add to history
                setScanHistory(prev => [{
                    text,
                    timestamp: new Date(),
                    type
                }, ...prev.slice(0, 4)]) // Keep last 5 scans

                // Handle based on type with delay to avoid popup conflicts
                setTimeout(() => {
                    handleQRResult(text, type)
                }, 100)

                // Return true to close scanner
                return true
            }
        )
    }

    const scanQRCodeLinksOnly = () => {
        webApp?.showScanQrPopup(
            { text: 'Scan a QR code containing a URL' },
            (text: string) => {
                // Check if it's a valid URL
                const lowerText = text.toLowerCase()
                if (lowerText.startsWith('http://') || lowerText.startsWith('https://')) {
                    webApp.HapticFeedback.notificationOccurred('success')

                    // Add to history
                    setScanHistory(prev => [{
                        text,
                        timestamp: new Date(),
                        type: 'URL'
                    }, ...prev.slice(0, 4)])

                    // Ask user if they want to open the link with proper delay
                    setTimeout(() => {
                        webApp.showConfirm(
                            `Open this link?\n\n${text}`,
                            (confirmed) => {
                                if (confirmed) {
                                    webApp.openLink(text)
                                }
                            }
                        )
                    }, 100) // Increased delay for safety

                    return true
                } else {
                    // Not a URL, keep scanner open
                    // Only use haptic feedback, no alert while scanner is open
                    webApp.HapticFeedback.notificationOccurred('error')
                    return false
                }
            }
        )
    }

    const scanGameCode = () => {
        webApp?.showScanQrPopup(
            { text: 'Scan game bonus code' },
            (text: string) => {
                // Check if it's a valid game code format
                if (text.match(/^BONUS-[A-Z0-9]{6}$/)) {
                    webApp.HapticFeedback.notificationOccurred('success')

                    setScanHistory(prev => [{
                        text,
                        timestamp: new Date(),
                        type: 'Game Code'
                    }, ...prev.slice(0, 4)])

                    // Delay the success alert to avoid popup conflict
                    setTimeout(() => {
                        webApp.showAlert(`🎉 Bonus code activated!\n\nYou received 100 coins!`)
                    }, 100)

                    return true
                } else {
                    // Invalid code - use haptic feedback only
                    // Don't show alert while scanner is still open
                    webApp.HapticFeedback.notificationOccurred('error')

                    // Optionally, you could show a toast or update UI state
                    // to indicate invalid code without using popups

                    return false // Keep scanner open
                }
            }
        )
    }

    const detectQRType = (text: string): string => {
        const lowerText = text.toLowerCase()

        // URL detection
        if (lowerText.startsWith('http://') || lowerText.startsWith('https://')) {
            return 'URL'
        }

        // Email detection
        if (lowerText.startsWith('mailto:') || text.includes('@')) {
            return 'Email'
        }

        // Phone detection
        if (lowerText.startsWith('tel:') || text.match(/^\+?[\d\s\-\(\)]+$/)) {
            return 'Phone'
        }

        // WiFi detection
        if (lowerText.startsWith('wifi:')) {
            return 'WiFi'
        }

        // Telegram link detection
        if (lowerText.includes('t.me/') || lowerText.includes('telegram.me/')) {
            return 'Telegram'
        }

        // Game code detection
        if (text.match(/^BONUS-[A-Z0-9]{6}$/)) {
            return 'Game Code'
        }

        // vCard detection
        if (lowerText.startsWith('begin:vcard')) {
            return 'Contact'
        }

        // SMS detection
        if (lowerText.startsWith('sms:') || lowerText.startsWith('smsto:')) {
            return 'SMS'
        }

        // Default
        return 'Text'
    }

    const handleQRResult = (text: string, type: string) => {
        // Haptic feedback first (doesn't conflict with popups)
        webApp?.HapticFeedback.notificationOccurred('success')

        switch (type) {
            case 'URL':
                webApp?.showConfirm(
                    `Open this link?\n\n${text}`,
                    (confirmed) => {
                        if (confirmed) {
                            webApp.openLink(text)
                        }
                    }
                )
                break

            case 'Telegram':
                webApp?.showConfirm(
                    `Open in Telegram?\n\n${text}`,
                    (confirmed) => {
                        if (confirmed) {
                            webApp.openTelegramLink(text)
                        }
                    }
                )
                break

            case 'Email':
                const email = text.replace('mailto:', '')
                webApp?.showAlert(`Email address:\n${email}`)
                break

            case 'Phone':
                const phone = text.replace('tel:', '')
                webApp?.showAlert(`Phone number:\n${phone}`)
                break

            case 'WiFi':
                webApp?.showAlert('WiFi network detected!\n\n' + parseWiFiQR(text))
                break

            case 'Game Code':
                // Already handled in scanGameCode with proper delay
                break

            default:
                webApp?.showAlert(`Scanned ${type}:\n\n${text}`)
        }
    }

    const parseWiFiQR = (text: string): string => {
        // Basic WiFi QR code parser
        const parts = text.split(';')
        let result = ''

        parts.forEach(part => {
            if (part.startsWith('S:')) {
                result += `Network: ${part.substring(2)}\n`
            } else if (part.startsWith('T:')) {
                result += `Security: ${part.substring(2)}\n`
            } else if (part.startsWith('P:')) {
                result += `Password: ${part.substring(2)}\n`
            }
        })

        return result || text
    }

    const clearHistory = () => {
        setScanHistory([])
        webApp?.HapticFeedback.notificationOccurred('success')
    }

    // Check version support
    const supportsQRScanner = webApp?.isVersionAtLeast('6.9') ?? false

    return (
        <div className="space-y-6">
            <DemoSection title="📷 QR Code Scanner">
                <div className="space-y-4">
                    {/* Version check */}
                    {webApp && !supportsQRScanner && (
                        <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                ⚠️ QR Scanner requires Telegram version 6.9 or higher.
                                Your version: {webApp.version}
                            </p>
                        </div>
                    )}

                    {/* Main scanner buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={scanQRCode}
                            className="btn-primary w-full"
                            disabled={!supportsQRScanner}
                        >
                            📷 Scan Any QR Code
                        </button>

                        <button
                            onClick={scanQRCodeLinksOnly}
                            className="btn-primary w-full"
                            disabled={!supportsQRScanner}
                        >
                            🔗 Scan URLs Only
                        </button>

                        <button
                            onClick={scanGameCode}
                            className="btn-primary w-full"
                            disabled={!supportsQRScanner}
                        >
                            🎮 Scan Game Bonus Code
                        </button>
                    </div>

                    {/* Info box */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            💡 <strong>Tip:</strong> The QR scanner can detect different types of QR codes
                            and handle them appropriately. Try scanning URLs, phone numbers, WiFi credentials,
                            or game bonus codes!
                        </p>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Basic QR scanner
webApp.showScanQrPopup({
  text: 'Scan any QR code'
}, (text) => {
  console.log('Scanned:', text)
  
  // Delay any popups to avoid conflicts
  setTimeout(() => {
    handleScannedData(text)
  }, 100)
  
  // Return true to close scanner
  return true
})

// URL-only scanner with validation
webApp.showScanQrPopup({
  text: 'Scan a URL'
}, (text) => {
  if (text.startsWith('http://') || text.startsWith('https://')) {
    // Valid URL - close scanner first
    setTimeout(() => {
      webApp.openLink(text)
    }, 100)
    return true // Close scanner
  } else {
    // Invalid, keep scanner open
    // Use haptic feedback instead of alert
    webApp.HapticFeedback.notificationOccurred('error')
    return false
  }
})

// Game code scanner with format validation
webApp.showScanQrPopup({
  text: 'Scan bonus code'
}, (text) => {
  if (text.match(/^BONUS-[A-Z0-9]{6}$/)) {
    // Valid code - close scanner first
    setTimeout(() => {
      activateBonusCode(text)
      webApp.showAlert('Code activated!')
    }, 100)
    return true
  } else {
    // Don't show alert while scanner is open!
    webApp.HapticFeedback.notificationOccurred('error')
    return false // Keep scanner open
  }
})

// Best practice: Never show popups when returning false
// Always add delays when showing popups after returning true`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="📋 Scan History">
                <div className="space-y-3">
                    {scanHistory.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold">Recent Scans</h4>
                                <button
                                    onClick={clearHistory}
                                    className="text-sm text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)]"
                                >
                                    Clear History
                                </button>
                            </div>

                            {scanHistory.map((scan, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-sm">{scan.type}</span>
                                        <span className="text-xs text-[var(--tg-theme-hint-color)]">
                                            {scan.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-sm break-all text-[var(--tg-theme-hint-color)]">
                                        {scan.text}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="text-center text-[var(--tg-theme-hint-color)]">
                            No QR codes scanned yet
                        </p>
                    )}
                </div>
            </DemoSection>

            <DemoSection title="🎯 QR Code Types">
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <div className="font-semibold mb-1">🔗 URLs</div>
                        <div className="text-sm text-[var(--tg-theme-hint-color)]">
                            Website links, deep links
                        </div>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <div className="font-semibold mb-1">📱 Contact Info</div>
                        <div className="text-sm text-[var(--tg-theme-hint-color)]">
                            Phone, email, vCard
                        </div>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <div className="font-semibold mb-1">📶 WiFi</div>
                        <div className="text-sm text-[var(--tg-theme-hint-color)]">
                            Network credentials
                        </div>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <div className="font-semibold mb-1">🎮 Game Codes</div>
                        <div className="text-sm text-[var(--tg-theme-hint-color)]">
                            Bonus codes, unlocks
                        </div>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title="💡 Use Cases">
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">🎮 Gaming</h4>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] mt-1 space-y-1">
                            <li>• Unlock bonus levels or items</li>
                            <li>• Share game rooms or lobbies</li>
                            <li>• Redeem promotional codes</li>
                            <li>• Transfer items between players</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">🛍️ E-commerce</h4>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] mt-1 space-y-1">
                            <li>• Quick product lookup</li>
                            <li>• Apply discount codes</li>
                            <li>• Track shipments</li>
                            <li>• Verify authenticity</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">🎫 Events</h4>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] mt-1 space-y-1">
                            <li>• Check-in attendees</li>
                            <li>• Validate tickets</li>
                            <li>• Share contact info</li>
                            <li>• Access event WiFi</li>
                        </ul>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title="🎲 Sample QR Codes">
                <div className="space-y-3">
                    <p className="text-sm text-[var(--tg-theme-hint-color)]">
                        Try scanning these sample codes to test the scanner:
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="bg-white p-2 rounded mb-2">
                                <QRCode
                                    value="BONUS-ABC123"
                                    size={100}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div className="text-xs font-mono text-center">BONUS-ABC123</div>
                            <div className="text-xs text-[var(--tg-theme-hint-color)] text-center">Game Code</div>
                        </div>

                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="bg-white p-2 rounded mb-2">
                                <QRCode
                                    value="https://nikandr.com"
                                    size={100}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div className="text-xs font-mono text-center">nikandr.com</div>
                            <div className="text-xs text-[var(--tg-theme-hint-color)] text-center">URL</div>
                        </div>

                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="bg-white p-2 rounded mb-2">
                                <QRCode
                                    value="tel:+1234567890"
                                    size={100}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div className="text-xs font-mono text-center">+1234567890</div>
                            <div className="text-xs text-[var(--tg-theme-hint-color)] text-center">Phone</div>
                        </div>

                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="bg-white p-2 rounded mb-2">
                                <QRCode
                                    value="mailto:test@example.com"
                                    size={100}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div className="text-xs font-mono text-center">test@example.com</div>
                            <div className="text-xs text-[var(--tg-theme-hint-color)] text-center">Email</div>
                        </div>
                    </div>

                    {/* Add more complex examples */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="bg-white p-2 rounded mb-2">
                                <QRCode
                                    value="WIFI:T:WPA;S:MyNetwork;P:MyPassword;;"
                                    size={100}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div className="text-xs font-mono text-center">WiFi Network</div>
                            <div className="text-xs text-[var(--tg-theme-hint-color)] text-center">Connect to WiFi</div>
                        </div>

                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="bg-white p-2 rounded mb-2">
                                <QRCode
                                    value="https://t.me/NikandrApps"
                                    size={100}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div className="text-xs font-mono text-center">@NikandrApps</div>
                            <div className="text-xs text-[var(--tg-theme-hint-color)] text-center">Telegram Link</div>
                        </div>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}