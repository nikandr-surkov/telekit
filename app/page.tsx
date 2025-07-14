// app/page.tsx

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
import { motion } from 'framer-motion'
import { useTelegram } from '@/providers/TelegramProvider'
import NavigationTabs from '@/components/NavigationTabs'
import CoreApiDemo from '@/components/demos/CoreApiDemo'
import ButtonsDemo from '@/components/demos/ButtonsDemo'
import StorageDemo from '@/components/demos/StorageDemo'
import HapticsDemo from '@/components/demos/HapticsDemo'
import SensorsDemo from '@/components/demos/SensorsDemo'
import BiometricsDemo from '@/components/demos/BiometricsDemo'
import GameFeaturesDemo from '@/components/demos/GameFeaturesDemo'
import PaymentsDemo from '@/components/demos/PaymentsDemo'
import ActivityDemo from '@/components/demos/ActivityDemo'
import EmojiStatusDemo from '@/components/demos/EmojiStatusDemo'
import FileOperationsDemo from '@/components/demos/FileOperationsDemo'
import InitDataDemo from '@/components/demos/InitDataDemo'
import LinksDemo from '@/components/demos/LinksDemo'
import PopupsDemo from '@/components/demos/PopupsDemo'
import ShareStoryDemo from '@/components/demos/ShareStoryDemo'
import HomeScreenDemo from '@/components/demos/HomeScreenDemo'
import QRScannerDemo from '@/components/demos/QRScannerDemo'
import AboutDemo from '@/components/demos/AboutDemo'

export default function Home() {
  const { isReady, user } = useTelegram()
  const [activeTab, setActiveTab] = useState('core')

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-telegram-blue border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#0088cc] to-[#006ba6]">
        {/* Beautiful animated gradient line */}
        <div className="h-0.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x" />
        </div>

        <div className="px-6 py-4">
          <div className="max-w-2xl mx-auto">
            {/* Title group */}
            <div className="space-y-0.5 text-center">
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Telegram Dev Kit
              </h1>
              <p className="text-xs text-white/70 font-medium tracking-wide uppercase">
                by Nikandr Surkov
              </p>
            </div>

            {/* User badge */}
            {user && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-3 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-white">{user.first_name}</span>
                  {user.is_premium && <span className="animate-spin-slow">⭐</span>}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="p-4 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'about' && <AboutDemo />}
          {activeTab === 'init' && <InitDataDemo />}
          {activeTab === 'core' && <CoreApiDemo />}
          {activeTab === 'buttons' && <ButtonsDemo />}
          {activeTab === 'storage' && <StorageDemo />}
          {activeTab === 'haptics' && <HapticsDemo />}
          {activeTab === 'sensors' && <SensorsDemo />}
          {activeTab === 'biometrics' && <BiometricsDemo />}
          {activeTab === 'game' && <GameFeaturesDemo />}
          {activeTab === 'payments' && <PaymentsDemo />}
          {activeTab === 'emoji' && <EmojiStatusDemo />}
          {activeTab === 'files' && <FileOperationsDemo />}
          {activeTab === 'activity' && <ActivityDemo />}
          {activeTab === 'links' && <LinksDemo />}
          {activeTab === 'popups' && <PopupsDemo />}
          {activeTab === 'qr' && <QRScannerDemo />}
          {activeTab === 'share' && <ShareStoryDemo />}
          {activeTab === 'homescreen' && <HomeScreenDemo />}
        </motion.div>
      </div>
    </main>
  )
}