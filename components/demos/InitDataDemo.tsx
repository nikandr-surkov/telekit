// components/demos/InitDataDemo.tsx

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

export default function InitDataDemo() {
  const { webApp } = useTelegram()
  const initData = webApp?.initData || ''
  const initDataUnsafe = webApp?.initDataUnsafe || {}
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean | null
    message: string
  }>({ isValid: null, message: '' })
  const [isValidating, setIsValidating] = useState(false)

  const validateInitData = async () => {
    if (!initData) {
      webApp?.showAlert('No init data available to validate')
      return
    }

    setIsValidating(true)
    try {
      const response = await fetch('/api/telegram/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData })
      })

      const result = await response.json()
      setValidationResult({
        isValid: result.valid,
        message: result.valid ? 'Init data is valid!' : 'Init data validation failed'
      })

      webApp?.HapticFeedback.notificationOccurred(result.valid ? 'success' : 'error')
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: 'Error validating init data'
      })
      webApp?.HapticFeedback.notificationOccurred('error')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-6">
      <DemoSection title="🔐 Init Data">
        <div className="space-y-4">
          <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
            <h4 className="font-semibold mb-2">Raw Init Data</h4>
            <p className="text-xs break-all font-mono">
              {initData || 'No init data available'}
            </p>
          </div>

          <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
            <h4 className="font-semibold mb-2">Parsed Data</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(initDataUnsafe, null, 2)}
            </pre>
          </div>

          <div className="space-y-3">
            <button
              onClick={validateInitData}
              disabled={!initData || isValidating}
              className="btn-primary w-full"
            >
              {isValidating ? 'Validating...' : 'Validate Init Data'}
            </button>

            {validationResult.isValid !== null && (
              <div className={`p-3 rounded text-sm ${validationResult.isValid
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-red-500/20 text-red-600 dark:text-red-400'
                }`}>
                {validationResult.isValid ? '✅' : '❌'} {validationResult.message}
              </div>
            )}
          </div>
        </div>

        <CodeBlock language="bash">
          {`# Install the validation package
npm install @telegram-apps/init-data-node
# or
yarn add @telegram-apps/init-data-node`}
        </CodeBlock>

        <CodeBlock language="typescript">
          {`// === SIMPLE VALIDATION EXAMPLE ===

// 1. API Route: app/api/telegram/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validate, parse } from '@telegram-apps/init-data-node'

export async function POST(request: NextRequest) {
  const { initData } = await request.json()
  const botToken = process.env.TELEGRAM_BOT_TOKEN!
  
  try {
    // Validate the init data (throws if invalid)
    validate(initData, botToken)
    
    // Parse to get user info
    const data = parse(initData)
    
    return NextResponse.json({ 
      valid: true, 
      user: data.user 
    })
  } catch (error) {
    return NextResponse.json({ 
      valid: false, 
      error: 'Invalid init data' 
    }, { status: 401 })
  }
}

// 2. Protected API Route: app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validate, parse } from '@telegram-apps/init-data-node'

export async function GET(request: NextRequest) {
  const initData = request.headers.get('X-Telegram-Init-Data')
  
  if (!initData) {
    return NextResponse.json({ error: 'No auth' }, { status: 401 })
  }
  
  try {
    validate(initData, process.env.TELEGRAM_BOT_TOKEN!)
    const { user } = parse(initData)
    
    // Fetch user data from your database
    const profile = await getUserProfile(user.id)
    
    return NextResponse.json({ profile })
  } catch {
    return NextResponse.json({ error: 'Invalid auth' }, { status: 401 })
  }
}

// 3. Client-side usage
const fetchProfile = async () => {
  const response = await fetch('/api/user/profile', {
    headers: {
      'X-Telegram-Init-Data': webApp.initData
    }
  })
  
  if (response.ok) {
    const data = await response.json()
    console.log('Profile:', data.profile)
  }
}`}
        </CodeBlock>

        <DemoSection title="🛡️ With Expiration Check">
          <CodeBlock language="typescript">
            {`// Add expiration check (optional but recommended)
import { validate, parse } from '@telegram-apps/init-data-node'

export async function validateWithExpiry(
  initData: string, 
  maxAge = 3600 // 1 hour default
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!
  
  try {
    // This validates the hash
    validate(initData, botToken)
    
    // Parse and check auth_date
    const parsed = parse(initData)
    const authDate = parsed.authDate.getTime() / 1000
    const now = Date.now() / 1000
    
    if (now - authDate > maxAge) {
      throw new Error('Init data expired')
    }
    
    return { valid: true, data: parsed }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}`}
          </CodeBlock>
        </DemoSection>

        <DemoSection title="📝 Environment Setup">
          <CodeBlock language="bash">
            {`# .env.local
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Get your bot token from @BotFather in Telegram`}
          </CodeBlock>
        </DemoSection>
      </DemoSection>
    </div>
  )
}