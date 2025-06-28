// components/demos/PaymentsDemo.tsx
'use client'

import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function PaymentsDemo() {
    const { webApp, user } = useTelegram()

    const openInvoice = (item: string, price: string) => {
        // In a real app, you would generate this URL from your backend
        const invoiceUrl = `https://t.me/$your_bot?startapp=invoice_${item}`

        webApp?.openInvoice(invoiceUrl, (status: string) => {
            if (status === 'paid') {
                webApp.HapticFeedback.notificationOccurred('success')
                webApp.showAlert(`Thank you for purchasing ${item}!`)
            } else if (status === 'cancelled') {
                webApp.showAlert('Purchase cancelled')
            } else {
                webApp.showAlert('Payment failed')
            }
        })
    }

    const premiumFeatures = [
        { id: 'remove_ads', name: 'Remove Ads', price: '$2.99' },
        { id: 'premium_skins', name: 'Premium Skins', price: '$4.99' },
        { id: 'double_coins', name: 'Double Coins', price: '$9.99' },
        { id: 'vip_bundle', name: 'VIP Bundle', price: '$19.99' }
    ]

    return (
        <div className="space-y-6">
            <DemoSection title="💎 Premium Status">
                <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                    <div className="flex items-center justify-between">
                        <span>Telegram Premium</span>
                        <span className="font-bold">
                            {user?.is_premium ? '✅ Active' : '❌ Not Active'}
                        </span>
                    </div>
                    {user?.is_premium && (
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mt-2">
                            Premium users get 20% off all purchases!
                        </p>
                    )}
                </div>

                <CodeBlock language="typescript">
                    {`// Check premium status
if (webApp.initDataUnsafe.user?.is_premium) {
  // Apply premium benefits
  applyDiscount(0.2) // 20% off
  unlockPremiumFeatures()
}`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🛒 In-App Purchases">
                <div className="space-y-3">
                    {premiumFeatures.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded"
                        >
                            <div>
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-sm text-[var(--tg-theme-hint-color)]">
                                    {user?.is_premium ? (
                                        <>
                                            <span className="line-through">{item.price}</span>
                                            <span className="ml-2 text-green-500">
                                                ${(parseFloat(item.price.slice(1)) * 0.8).toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        item.price
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => openInvoice(item.name, item.price)}
                                className="btn-primary px-4 py-2"
                            >
                                Buy
                            </button>
                        </div>
                    ))}
                </div>

                <CodeBlock language="typescript">
                    {`// Process payment
webApp.openInvoice(invoiceUrl, (status) => {
  if (status === 'paid') {
    // Payment successful
    unlockPurchasedItem()
    saveToCloudStorage()
    showSuccessAnimation()
  } else if (status === 'cancelled') {
    // User cancelled
    console.log('Payment cancelled')
  } else {
    // Payment failed
    showError('Payment failed')
  }
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🎁 Monetization Strategies">
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Cosmetic Items</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Skins, themes, avatars - no gameplay advantage
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Time Savers</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Skip timers, instant upgrades, energy refills
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Premium Currency</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Gems, coins, tokens with bonus packages
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Battle Pass</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Seasonal content with free and premium tracks
                        </p>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title="💡 Best Practices">
                <div className="prose prose-sm text-[var(--tg-theme-text-color)]">
                    <ul className="space-y-2">
                        <li>Always validate purchases on your backend</li>
                        <li>Store purchase history in CloudStorage</li>
                        <li>Offer special discounts for Premium users</li>
                        <li>Use biometric auth for high-value purchases</li>
                        <li>Implement restore purchases functionality</li>
                        <li>Show clear value proposition for each item</li>
                    </ul>
                </div>
            </DemoSection>
        </div>
    )
}