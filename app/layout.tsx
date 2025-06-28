// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { TelegramProvider } from '@/providers/TelegramProvider'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Telegram Mini App Masterclass',
  description: 'Learn to build amazing Telegram Mini App games',
  formatDetection: { telephone: false },
  robots: 'noindex,nofollow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  minimumScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <TelegramProvider>
          {children}
        </TelegramProvider>
        <Analytics />
      </body>
    </html>
  )
}