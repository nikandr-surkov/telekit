// components/demos/PaymentsDemo.tsx
'use client'

import { useState } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function PaymentsDemo() {
    const { webApp, user } = useTelegram()
    const [starBalance, setStarBalance] = useState(0)

    // Create Stars invoice using the NEW Bot API method
    const createStarsInvoice = async (item: string, stars: number) => {
        try {
            // In a real app, this would call your backend to create an invoice
            // The backend would use the Bot API to create a Stars invoice

            // For demo purposes, we'll simulate the invoice creation
            webApp?.showAlert(`Creating invoice for ${stars} Stars...`)

            // The actual implementation would involve:
            // 1. Backend creates invoice via Bot API
            // 2. Returns invoice link
            // 3. Open the invoice in Telegram

            // Example of what the backend would do:
            /*
            const invoice = await bot.createInvoiceLink({
                title: item,
                description: `Purchase ${item} in our Mini App`,
                payload: `item_${Date.now()}`,
                currency: 'XTR', // XTR is the currency code for Telegram Stars
                prices: [{ label: item, amount: stars }]
            })
            */

        } catch (error) {
            webApp?.showAlert('Failed to create invoice')
        }
    }

    const sendGift = () => {
        webApp?.showAlert('Gift sending is now available through Telegram Stars!')
    }

    const premiumFeatures = [
        { id: 'remove_ads', name: 'Remove Ads', stars: 50 },
        { id: 'premium_skins', name: 'Premium Skins', stars: 100 },
        { id: 'double_coins', name: 'Double Coins', stars: 200 },
        { id: 'vip_bundle', name: 'VIP Bundle', stars: 500 },
        { id: 'monthly_sub', name: 'Monthly Subscription', stars: 250 }
    ]

    return (
        <div className="space-y-6">
            <DemoSection title="⭐ Telegram Stars Overview">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        Important: Stars are REQUIRED for Digital Goods
                    </h4>
                    <p className="text-sm">
                        Due to App Store and Play Store policies, all digital goods and services
                        must be sold exclusively using Telegram Stars.
                    </p>
                </div>

                <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span>Telegram Premium</span>
                            <span className="font-bold">
                                {user?.is_premium ? '✅ Active' : '❌ Not Active'}
                            </span>
                        </div>
                        <div className="text-sm text-[var(--tg-theme-hint-color)]">
                            Premium users may receive special discounts or bonus Stars
                        </div>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Bot API method to create Stars invoice (backend)
const invoice = await bot.createInvoiceLink({
  title: 'Premium Upgrade',
  description: 'Unlock all premium features',
  payload: 'premium_upgrade',
  currency: 'XTR', // Telegram Stars currency code
  prices: [{ 
    label: 'Premium Upgrade', 
    amount: 100 // Amount in Stars
  }]
})

// Send invoice to user
await bot.sendMessage(chatId, 'Complete your purchase:', {
  reply_markup: {
    inline_keyboard: [[{
      text: 'Pay 100 Stars',
      url: invoice
    }]]
  }
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="💫 Digital Products (Stars Only)">
                <div className="space-y-3">
                    {premiumFeatures.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded"
                        >
                            <div>
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-sm text-[var(--tg-theme-hint-color)]">
                                    ⭐ {item.stars} Stars
                                </div>
                            </div>
                            <button
                                onClick={() => createStarsInvoice(item.name, item.stars)}
                                className="btn-primary px-4 py-2"
                            >
                                Buy
                            </button>
                        </div>
                    ))}
                </div>

                <CodeBlock language="typescript">
                    {`// Handle payment result (backend webhook)
bot.on('pre_checkout_query', async (query) => {
  // Validate the payment
  await bot.answerPreCheckoutQuery(query.id, true)
})

bot.on('successful_payment', async (ctx) => {
  const payment = ctx.message.successful_payment
  
  // Payment completed!
  // - Grant digital goods to user
  // - Save to database
  // - Send confirmation
  
  await ctx.reply('Thank you! Your purchase is complete.')
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🎁 New Features with Stars">
                <div className="space-y-4">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold mb-2">🎁 Send Gifts</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mb-3">
                            Mini Apps can use their balance of Telegram Stars to send gifts to their users.
                        </p>
                        <button onClick={sendGift} className="btn-primary w-full">
                            Send Gift to User
                        </button>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold mb-2">🔄 Subscriptions</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Mini Apps now support paid subscriptions powered by Telegram Stars – monetizing their efforts with multiple tiers of content and features.
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold mb-2">💰 Affiliate Programs</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            In December 2024, Telegram also introduced Affiliate Programs, allowing users and channels to earn Stars by referring paying users to mini apps (for a percentage of referred users' payments).
                        </p>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title="💸 Stars Pricing Reference">
                <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                    <p className="text-sm text-[var(--tg-theme-hint-color)] mb-3">
                        Common Star packages and approximate USD values:
                    </p>
                    <div className="space-y-2 text-sm">
                        <div>⭐ 50 Stars ≈ $0.99</div>
                        <div>⭐ 100 Stars ≈ $1.99</div>
                        <div>⭐ 250 Stars ≈ $4.99</div>
                        <div>⭐ 500 Stars ≈ $9.99</div>
                        <div>⭐ 1000 Stars ≈ $19.99</div>
                    </div>
                    <p className="text-xs text-[var(--tg-theme-hint-color)] mt-3">
                        * Prices vary by region and may include VAT
                    </p>
                </div>
            </DemoSection>

            <DemoSection title="⚖️ Physical vs Digital Goods">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
                        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                            ✅ Physical Goods
                        </h4>
                        <ul className="text-sm space-y-1">
                            <li>• Can use any payment provider</li>
                            <li>• Multiple currencies allowed</li>
                            <li>• Examples: merchandise, books, devices</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                            ⭐ Digital Goods (Stars Only)
                        </h4>
                        <ul className="text-sm space-y-1">
                            <li>• Must use Telegram Stars</li>
                            <li>• Examples: in-app items, subscriptions</li>
                            <li>• Compliant with app store policies</li>
                        </ul>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title="🔧 Implementation Guide">
                <CodeBlock language="typescript">
                    {`// Complete Stars payment flow

// 1. Frontend - Request invoice creation
async function purchaseItem(itemId: string, stars: number) {
  const response = await fetch('/api/create-invoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`tma \${webApp.initData}\`
    },
    body: JSON.stringify({ itemId, stars })
  })
  
  const { invoiceUrl } = await response.json()
  
  // Open invoice in Telegram
  webApp.openTelegramLink(invoiceUrl)
}

// 2. Backend - Create Stars invoice
app.post('/api/create-invoice', async (req, res) => {
  const { itemId, stars } = req.body
  
  const invoice = await bot.api.createInvoiceLink({
    title: 'Game Item',
    description: 'Premium game content',
    payload: JSON.stringify({ itemId, userId }),
    provider_token: '', // Empty for Stars
    currency: 'XTR',
    prices: [{ 
      label: 'Item', 
      amount: stars 
    }]
  })
  
  res.json({ invoiceUrl: invoice })
})

// 3. Handle successful payment
bot.on('successful_payment', async (ctx) => {
  const { payload, telegram_payment_charge_id } = 
    ctx.message.successful_payment
  
  const { itemId, userId } = JSON.parse(payload)
  
  // Grant item to user
  await grantItemToUser(userId, itemId)
  
  // Optional: Send gift as reward
  await bot.api.sendGift(userId, giftId)
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="💡 Best Practices">
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Always Use Stars for Digital Content</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Any virtual items, premium features, or digital services must use Stars
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Implement Refunds</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Use the refundStarPayment method for customer disputes
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Consider Subscriptions</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Recurring Stars payments for continuous content access
                        </p>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">Leverage Affiliate Programs</h4>
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Let users earn Stars by referring others to your Mini App
                        </p>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}