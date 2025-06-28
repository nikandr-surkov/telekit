// components/demos/InitDataDemo.tsx
'use client'

import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function InitDataDemo() {
    const { webApp } = useTelegram()
    const initData = webApp?.initData || ''
    const initDataUnsafe = webApp?.initDataUnsafe || {}

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
                </div>

                <CodeBlock language="typescript">
                    {`// Send init data to backend for validation
fetch('/api/validate', {
  method: 'POST',
  headers: {
    'Authorization': \`tma \${webApp.initData}\`
  }
})

// Backend validation (Node.js)
const crypto = require('crypto')

function validateInitData(initData, botToken) {
  const urlParams = new URLSearchParams(initData)
  const hash = urlParams.get('hash')
  urlParams.delete('hash')
  
  const dataCheckString = [...urlParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => \`\${k}=\${v}\`)
    .join('\\n')
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest()
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')
  
  return calculatedHash === hash
}`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}