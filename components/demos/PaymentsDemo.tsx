// components/demos/PaymentsDemo.tsx

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

export default function PaymentsDemo() {
    const { webApp, user } = useTelegram()
    const [activeTab, setActiveTab] = useState<'overview' | 'implementation' | 'backend' | 'testing'>('overview')

    const tabs = [
        { id: 'overview' as const, label: 'Overview', icon: '📋' },
        { id: 'implementation' as const, label: 'Implementation', icon: '🔧' },
        { id: 'backend' as const, label: 'Backend Setup', icon: '🖥️' },
        { id: 'testing' as const, label: 'Testing', icon: '🧪' }
    ]

    return (
        <div className="space-y-6 w-full">
            <DemoSection title="⭐ Telegram Stars Payments">
                {/* Tab Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]'
                                : 'bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]'
                                }`}
                        >
                            <span className="mr-1">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content - Removed overflow-hidden */}
                <div className="mt-6 w-full">
                    {activeTab === 'overview' && <OverviewTab user={user} />}
                    {activeTab === 'implementation' && <ImplementationTab />}
                    {activeTab === 'backend' && <BackendTab />}
                    {activeTab === 'testing' && <TestingTab />}
                </div>
            </DemoSection>
        </div>
    )
}

function OverviewTab({ user }: { user: any }) {
    return (
        <div className="space-y-6 w-full">
            {/* Key Points */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                    ⚠️ Important: Digital Goods Policy
                </h3>
                <p className="text-sm mb-3">
                    Due to App Store and Play Store policies, all digital goods and services
                    in Telegram Mini Apps must be sold exclusively using Telegram Stars.
                </p>
                <ul className="text-sm space-y-1">
                    <li>• <strong>Digital goods</strong>: Must use Stars (in-app items, subscriptions, features)</li>
                    <li>• <strong>Physical goods</strong>: Can use any payment provider</li>
                    <li>• <strong>Currency code</strong>: XTR (Telegram Stars)</li>
                </ul>
            </div>

            {/* What are Telegram Stars? */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">What are Telegram Stars?</h3>
                <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                    <p className="text-sm mb-3">
                        Telegram Stars are an in-app currency that users can purchase through:
                    </p>
                    <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                            <span>📱</span>
                            <div>
                                <strong>App Stores</strong>: Apple Pay, Google Pay
                                <p className="text-xs text-[var(--tg-theme-hint-color)]">
                                    Integrated with platform payment systems
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>🤖</span>
                            <div>
                                <strong>@PremiumBot</strong>: Direct purchase from Telegram
                                <p className="text-xs text-[var(--tg-theme-hint-color)]">
                                    Alternative payment methods available
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Pricing Reference */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">💸 Stars Pricing Reference</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { stars: 50, price: '$0.99' },
                        { stars: 100, price: '$1.99' },
                        { stars: 250, price: '$4.99' },
                        { stars: 500, price: '$9.99' },
                        { stars: 1000, price: '$19.99' },
                        { stars: 2500, price: '$49.99' }
                    ].map(item => (
                        <div key={item.stars} className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">⭐ {item.stars}</span>
                                <span className="text-sm text-[var(--tg-theme-hint-color)]">≈ {item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-[var(--tg-theme-hint-color)]">
                    * Prices vary by region and may include VAT
                </p>
            </div>

            {/* Payment Flow */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">🔄 Payment Flow</h3>
                <div className="space-y-3">
                    {[
                        { step: 1, title: 'Create Invoice', desc: 'Backend creates invoice via Bot API' },
                        { step: 2, title: 'Open Payment UI', desc: 'Mini App opens invoice in Telegram' },
                        { step: 3, title: 'User Pays', desc: 'User purchases Stars if needed and pays' },
                        { step: 4, title: 'Verify Payment', desc: 'Bot receives payment confirmation' },
                        { step: 5, title: 'Deliver Goods', desc: 'Grant access to digital content' }
                    ].map(item => (
                        <div key={item.step} className="flex gap-3">
                            <div className="w-8 h-8 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                {item.step}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{item.title}</p>
                                <p className="text-xs text-[var(--tg-theme-hint-color)]">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* New Features */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">✨ Latest Features</h3>
                <div className="grid gap-3">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-1">
                            🎁 Gift System
                        </h4>
                        <p className="text-sm">
                            Send gifts to users using your Mini App's Stars balance for engagement and rewards
                        </p>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                            🔄 Subscriptions
                        </h4>
                        <p className="text-sm">
                            Implement recurring payments with multiple subscription tiers
                        </p>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">
                            💰 Affiliate Program
                        </h4>
                        <p className="text-sm">
                            Let users earn Stars by referring others (percentage of payments)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ImplementationTab() {
    return (
        <div className="space-y-6 w-full">
            <h3 className="text-lg font-semibold">Frontend Implementation</h3>

            {/* Step 1: Install Dependencies */}
            <div className="space-y-3">
                <h4 className="font-semibold">Step 1: Install Dependencies</h4>
                <CodeBlock language="bash">
                    {`npm install @twa-dev/sdk
# or
yarn add @twa-dev/sdk`}
                </CodeBlock>
            </div>

            {/* Step 2: Create Invoice Request */}
            <div className="space-y-3">
                <h4 className="font-semibold">Step 2: Request Invoice from Backend</h4>
                <CodeBlock language="typescript">
                    {`// Frontend: Request invoice creation
async function purchaseItem(itemId: string, stars: number) {
  try {
    // Call your backend to create invoice
    const response = await fetch('/api/create-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': webApp.initData // Send auth data
      },
      body: JSON.stringify({ itemId, stars })
    })
    
    if (!response.ok) {
      throw new Error('Failed to create invoice')
    }
    
    const { invoiceLink } = await response.json()
    
    // Open invoice in Telegram
    webApp.openInvoice(invoiceLink, (status) => {
      if (status === 'paid') {
        // Payment successful
        console.log('Payment completed!')
        // Update UI, grant access, etc.
      } else if (status === 'cancelled') {
        console.log('Payment cancelled')
      } else if (status === 'failed') {
        console.log('Payment failed')
      }
    })
  } catch (error) {
    console.error('Purchase error:', error)
  }
}`}
                </CodeBlock>
            </div>

            {/* Step 3: Handle Payment Status */}
            <div className="space-y-3">
                <h4 className="font-semibold">Step 3: Handle Payment Status</h4>
                <CodeBlock language="typescript">
                    {`// Complete payment handling example
import { useState } from 'react'
import WebApp from '@twa-dev/sdk'

function PaymentButton({ product }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)
  
  const handlePurchase = async () => {
    setIsLoading(true)
    
    try {
      // 1. Create invoice
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': WebApp.initData
        },
        body: JSON.stringify({
          productId: product.id,
          stars: product.price
        })
      })
      
      const { invoiceLink } = await response.json()
      
      // 2. Open payment UI
      WebApp.openInvoice(invoiceLink, async (status) => {
        if (status === 'paid') {
          // 3. Verify payment on backend
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Telegram-Init-Data': WebApp.initData
            },
            body: JSON.stringify({ productId: product.id })
          })
          
          if (verifyResponse.ok) {
            setIsPurchased(true)
            WebApp.showAlert('Purchase successful!')
          }
        }
        
        setIsLoading(false)
      })
    } catch (error) {
      setIsLoading(false)
      WebApp.showAlert('Purchase failed. Please try again.')
    }
  }
  
  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading || isPurchased}
      className="btn-primary"
    >
      {isPurchased ? 'Purchased' : \`Buy for \${product.price} Stars\`}
    </button>
  )
}`}
                </CodeBlock>
            </div>

            {/* Best Practices */}
            <div className="space-y-3">
                <h4 className="font-semibold">Frontend Best Practices</h4>
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h5 className="font-semibold mb-1">🔒 Security</h5>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] space-y-1">
                            <li>• Always send initData to backend for validation</li>
                            <li>• Never trust client-side payment status</li>
                            <li>• Verify all payments on the backend</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h5 className="font-semibold mb-1">🎨 UI/UX</h5>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] space-y-1">
                            <li>• Show loading states during payment</li>
                            <li>• Disable buttons to prevent double-clicks</li>
                            <li>• Provide clear error messages</li>
                            <li>• Use haptic feedback for success/error</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h5 className="font-semibold mb-1">⚡ Performance</h5>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] space-y-1">
                            <li>• Cache purchase status locally</li>
                            <li>• Implement optimistic UI updates</li>
                            <li>• Handle network errors gracefully</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BackendTab() {
    return (
        <div className="space-y-6 w-full">
            <h3 className="text-lg font-semibold">Backend Setup</h3>

            {/* Bot Setup */}
            <div className="space-y-3">
                <h4 className="font-semibold">Step 1: Create Telegram Bot</h4>
                <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                    <ol className="text-sm space-y-2">
                        <li>1. Open <code className="px-1 py-0.5 bg-[var(--tg-theme-bg-color)] rounded">@BotFather</code> in Telegram</li>
                        <li>2. Send <code className="px-1 py-0.5 bg-[var(--tg-theme-bg-color)] rounded">/newbot</code> and follow instructions</li>
                        <li>3. Save your bot token securely</li>
                        <li>4. Enable inline mode if needed: <code className="px-1 py-0.5 bg-[var(--tg-theme-bg-color)] rounded">/setinline</code></li>
                    </ol>
                </div>
            </div>

            {/* Environment Variables */}
            <div className="space-y-3">
                <h4 className="font-semibold">Step 2: Environment Variables</h4>
                <CodeBlock language="bash">
                    {`# .env.local
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
DATABASE_URL=your_database_connection_string
WEBHOOK_URL=https://yourdomain.com/api/telegram-webhook`}
                </CodeBlock>
            </div>

            {/* Create Invoice API */}
            <div className="space-y-3">
                <h4 className="font-semibold">Step 3: Create Invoice Endpoint</h4>
                <CodeBlock language="typescript">
                    {`// app/api/create-invoice/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validate, parse } from '@telegram-apps/init-data-node'

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Telegram authentication
    const initData = req.headers.get('X-Telegram-Init-Data')
    if (!initData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN!
    validate(initData, botToken)
    const { user } = parse(initData)

    // 2. Get product details
    const { productId, stars } = await req.json()
    
    // 3. Create unique payment ID
    const paymentId = \`\${user.id}_\${productId}_\${Date.now()}\`
    
    // 4. Store pending payment in database
    await db.payments.create({
      id: paymentId,
      userId: user.id,
      productId,
      stars,
      status: 'pending',
      createdAt: new Date()
    })

    // 5. Create invoice via Telegram Bot API
    const response = await fetch(
      \`https://api.telegram.org/bot\${botToken}/createInvoiceLink\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Premium Feature',
          description: 'Unlock premium features',
          payload: paymentId, // Important: use this to track payment
          provider_token: '', // Empty for Stars
          currency: 'XTR',    // Telegram Stars
          prices: [{ 
            label: 'Premium Feature', 
            amount: stars 
          }]
        })
      }
    )

    const data = await response.json()
    
    if (!data.ok) {
      throw new Error(data.description)
    }

    return NextResponse.json({ 
      invoiceLink: data.result,
      paymentId 
    })
  } catch (error) {
    console.error('Invoice creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}`}
                </CodeBlock>
            </div>

            {/* Webhook Handler */}
            <div className="space-y-3">
                <h4 className="font-semibold">Step 4: Handle Payment Webhook</h4>
                <CodeBlock language="typescript">
                    {`// app/api/telegram-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()
    
    // Handle pre-checkout query
    if (update.pre_checkout_query) {
      const query = update.pre_checkout_query
      
      // Verify the payment is valid
      const payment = await db.payments.findUnique({
        where: { id: query.invoice_payload }
      })
      
      if (payment && payment.status === 'pending') {
        // Approve the payment
        await fetch(
          \`https://api.telegram.org/bot\${process.env.TELEGRAM_BOT_TOKEN}/answerPreCheckoutQuery\`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pre_checkout_query_id: query.id,
              ok: true
            })
          }
        )
      } else {
        // Reject the payment
        await fetch(
          \`https://api.telegram.org/bot\${process.env.TELEGRAM_BOT_TOKEN}/answerPreCheckoutQuery\`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pre_checkout_query_id: query.id,
              ok: false,
              error_message: 'Payment not found or already processed'
            })
          }
        )
      }
    }
    
    // Handle successful payment
    if (update.message?.successful_payment) {
      const payment = update.message.successful_payment
      
      // Update payment status
      await db.payments.update({
        where: { id: payment.invoice_payload },
        data: {
          status: 'completed',
          telegramPaymentChargeId: payment.telegram_payment_charge_id,
          completedAt: new Date()
        }
      })
      
      // Grant access to digital goods
      await grantUserAccess(payment.invoice_payload)
      
      // Send confirmation to user
      await fetch(
        \`https://api.telegram.org/bot\${process.env.TELEGRAM_BOT_TOKEN}/sendMessage\`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: update.message.chat.id,
            text: '✅ Payment successful! Your purchase has been activated.'
          })
        }
      )
    }
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}`}
                </CodeBlock>
            </div>

            {/* Refund Implementation */}
            <div className="space-y-3">
                <h4 className="font-semibold">Step 5: Implement Refunds</h4>
                <CodeBlock language="typescript">
                    {`// app/api/refund/route.ts
export async function POST(req: NextRequest) {
  try {
    const { paymentId } = await req.json()
    
    // Get payment details
    const payment = await db.payments.findUnique({
      where: { id: paymentId }
    })
    
    if (!payment || payment.status !== 'completed') {
      return NextResponse.json(
        { error: 'Payment not found or not completed' },
        { status: 400 }
      )
    }
    
    // Call Telegram refund API
    const response = await fetch(
      \`https://api.telegram.org/bot\${process.env.TELEGRAM_BOT_TOKEN}/refundStarPayment\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: payment.userId,
          telegram_payment_charge_id: payment.telegramPaymentChargeId
        })
      }
    )
    
    const result = await response.json()
    
    if (result.ok) {
      // Update payment status
      await db.payments.update({
        where: { id: paymentId },
        data: { 
          status: 'refunded',
          refundedAt: new Date()
        }
      })
      
      // Revoke access
      await revokeUserAccess(paymentId)
      
      return NextResponse.json({ success: true })
    } else {
      throw new Error(result.description)
    }
  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}`}
                </CodeBlock>
            </div>

            {/* Database Schema */}
            <div className="space-y-3">
                <h4 className="font-semibold">Database Schema Example</h4>
                <CodeBlock language="typescript">
                    {`// Prisma schema example
model Payment {
  id                      String    @id @default(cuid())
  userId                  String
  productId               String
  stars                   Int
  status                  String    // pending, completed, refunded
  telegramPaymentChargeId String?
  createdAt               DateTime  @default(now())
  completedAt             DateTime?
  refundedAt              DateTime?
  
  @@index([userId])
  @@index([status])
}`}
                </CodeBlock>
            </div>
        </div>
    )
}

function TestingTab() {
    return (
        <div className="space-y-6 w-full">
            <h3 className="text-lg font-semibold">Testing Your Implementation</h3>

            {/* Recommended Testing Approach */}
            <div className="space-y-3">
                <h4 className="font-semibold">💡 Recommended Testing Strategy</h4>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h5 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                        Test with Real Stars + Easy Refunds
                    </h5>
                    <p className="text-sm mb-3">
                        The most practical approach is to test with real Stars and implement a simple refund mechanism.
                        This gives you the real experience without losing money.
                    </p>
                    <ol className="text-sm space-y-2">
                        <li>📱 <strong>Buy minimal Stars</strong>: Purchase 50 Stars for ~$1</li>
                        <li>🧪 <strong>Test with 1-star payments</strong>: Minimize cost per test</li>
                        <li>💾 <strong>Save transaction IDs</strong>: Store them for easy refunds</li>
                        <li>↩️ <strong>Refund after testing</strong>: Get your Stars back</li>
                    </ol>
                </div>
            </div>

            {/* Quick Refund Implementation */}
            <div className="space-y-3">
                <h4 className="font-semibold">🔄 Implementing Test Refunds</h4>
                <p className="text-sm text-[var(--tg-theme-hint-color)] mb-3">
                    Add a simple refund mechanism to your bot for testing purposes:
                </p>

                <CodeBlock language="typescript">
                    {`// Simple refund command for testing
bot.command('refund_test', async (ctx) => {
  // Only allow for admin/testing accounts
  const testUserIds = [YOUR_TEST_USER_ID]
  if (!testUserIds.includes(ctx.from.id)) {
    return ctx.reply('This command is only for testing')
  }

  // Get recent test purchases
  const recentPurchases = await db.payments.findMany({
    where: {
      userId: ctx.from.id,
      status: 'completed',
      createdAt: {
        // Last 24 hours
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  if (recentPurchases.length === 0) {
    return ctx.reply('No recent purchases found')
  }

  // Create refund buttons
  const keyboard = {
    inline_keyboard: recentPurchases.map(purchase => [{
      text: \`Refund \${purchase.stars} ⭐ - \${
        new Date(purchase.createdAt).toLocaleTimeString()
      }\`,
      callback_data: \`refund_\${purchase.id}\`
    }])
  }

  ctx.reply('Select a purchase to refund:', { 
    reply_markup: keyboard 
  })
})

// Handle refund callback
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data
  
  if (data?.startsWith('refund_')) {
    const paymentId = data.replace('refund_', '')
    const payment = await db.payments.findUnique({ 
      where: { id: paymentId } 
    })
    
    if (!payment) {
      return ctx.answerCallbackQuery('Payment not found')
    }

    try {
      // Process refund
      await ctx.api.refundStarPayment(
        payment.userId,
        payment.telegramPaymentChargeId
      )

      // Update database
      await db.payments.update({
        where: { id: paymentId },
        data: { status: 'refunded' }
      })

      ctx.answerCallbackQuery('✅ Refunded successfully!')
      ctx.editMessageText('✅ Refund processed!')
    } catch (error) {
      ctx.answerCallbackQuery('❌ Refund failed')
    }
  }
})`}
                </CodeBlock>
            </div>

            {/* Testing Checklist */}
            <div className="space-y-3">
                <h4 className="font-semibold">✅ Testing Checklist</h4>
                <div className="grid gap-2">
                    {[
                        { task: 'Create test product with 1 Star price', done: false },
                        { task: 'Implement refund command for test users', done: false },
                        { task: 'Test successful payment flow', done: false },
                        { task: 'Test cancelled payment handling', done: false },
                        { task: 'Test refund functionality', done: false },
                        { task: 'Verify webhook receives updates', done: false },
                        { task: 'Test duplicate payment prevention', done: false },
                        { task: 'Check error handling', done: false },
                        { task: 'Test with different user accounts', done: false },
                        { task: 'Verify database integrity', done: false }
                    ].map((item, index) => (
                        <label key={index} className="flex items-center gap-3 p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded cursor-pointer hover:bg-opacity-80">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm flex-1">{item.task}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Testing Tips */}
            <div className="space-y-3">
                <h4 className="font-semibold">💡 Testing Best Practices</h4>

                {/* Create Test Products */}
                <div className="space-y-2">
                    <h5 className="font-semibold">Create Test Products</h5>
                    <CodeBlock language="typescript">
                        {`// Add test products with minimal price
const TEST_PRODUCTS = [
  { 
    id: 'test_1star', 
    name: 'Test Item', 
    stars: 1 
  },
  { 
    id: 'test_feature', 
    name: 'Test Feature', 
    stars: 1 
  },
  { 
    id: 'test_premium', 
    name: 'Test Premium', 
    stars: 2 
  }
]

// Only show to test users
if (isTestUser(userId)) {
  products.push(...TEST_PRODUCTS)
}`}
                    </CodeBlock>
                </div>

                {/* Track Test Payments */}
                <div className="space-y-2">
                    <h5 className="font-semibold">Track Test Payments</h5>
                    <CodeBlock language="typescript">
                        {`// Add metadata to identify test payments
await db.payments.create({
  data: {
    userId,
    productId,
    stars,
    isTest: process.env.NODE_ENV !== 'production',
    metadata: {
      environment: process.env.NODE_ENV,
      testUser: isTestUser(userId)
    }
  }
})`}
                    </CodeBlock>
                </div>

                {/* Automated Test Cleanup */}
                <div className="space-y-2">
                    <h5 className="font-semibold">Automated Test Cleanup</h5>
                    <CodeBlock language="typescript">
                        {`// Daily cleanup of test purchases (optional)
async function cleanupTestPurchases() {
  const testPurchases = await db.payments.findMany({
    where: {
      isTest: true,
      status: 'completed',
      createdAt: { 
        lte: new Date(Date.now() - 24*60*60*1000) 
      }
    }
  })

  for (const purchase of testPurchases) {
    try {
      await bot.api.refundStarPayment(
        purchase.userId,
        purchase.telegramPaymentChargeId
      )
      
      await db.payments.update({
        where: { id: purchase.id },
        data: { status: 'auto_refunded' }
      })
    } catch (error) {
      console.error(
        'Auto-refund failed:', 
        purchase.id
      )
    }
  }
}`}
                    </CodeBlock>
                </div>
            </div>

            {/* Cost Analysis */}
            <div className="space-y-3">
                <h4 className="font-semibold">💰 Testing Cost Analysis</h4>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold">Initial Investment:</p>
                            <p className="text-2xl font-bold">$0.99</p>
                            <p className="text-xs text-[var(--tg-theme-hint-color)]">50 Stars minimum purchase</p>
                        </div>
                        <div>
                            <p className="font-semibold">Cost per Test:</p>
                            <p className="text-2xl font-bold">$0.02</p>
                            <p className="text-xs text-[var(--tg-theme-hint-color)]">1 Star ≈ $0.02 (refundable)</p>
                        </div>
                    </div>
                    <p className="text-sm mt-4 text-center">
                        With refunds, your actual testing cost is <strong>$0</strong> 🎉
                    </p>
                </div>
            </div>

            {/* Important Notes */}
            <div className="space-y-3">
                <h4 className="font-semibold">⚠️ Important Testing Notes</h4>
                <div className="space-y-3">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                        <p className="text-sm font-semibold mb-1">Invoice Reusability</p>
                        <p className="text-xs">
                            Paid invoices remain valid and can be paid again. Always check in your database
                            if a user has already purchased an item before delivering goods.
                        </p>
                    </div>

                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                        <p className="text-sm font-semibold mb-1">Transaction IDs</p>
                        <p className="text-xs">
                            Always store <code>telegram_payment_charge_id</code> from successful payments.
                            You need this for refunds.
                        </p>
                    </div>

                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                        <p className="text-sm font-semibold mb-1">Withdrawal Period</p>
                        <p className="text-xs">
                            Remember: You can only withdraw Stars to crypto after 3 weeks.
                            But refunds to users can be processed immediately.
                        </p>
                    </div>
                </div>
            </div>

            {/* Production Transition */}
            <div className="space-y-3">
                <h4 className="font-semibold">🚀 Transitioning to Production</h4>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm mb-3">Before going live:</p>
                    <ul className="text-sm space-y-2">
                        <li>✅ Remove or restrict test commands</li>
                        <li>✅ Disable automatic refunds</li>
                        <li>✅ Remove test products</li>
                        <li>✅ Set up proper monitoring</li>
                        <li>✅ Prepare customer support flow</li>
                        <li>✅ Document refund policy</li>
                        <li>✅ Enable 2FA on bot account</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}