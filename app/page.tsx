// app/page.tsx
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
import DataCommDemo from '@/components/demos/DataCommDemo'
import EmojiStatusDemo from '@/components/demos/EmojiStatusDemo'
import FileOperationsDemo from '@/components/demos/FileOperationsDemo'
import InitDataDemo from '@/components/demos/InitDataDemo'

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
      <header className="bg-[var(--tg-theme-header-bg-color)] p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">
          Telegram Mini App Masterclass
        </h1>
        {user && (
          <p className="text-center text-sm text-[var(--tg-theme-hint-color)] mt-1">
            Welcome, {user.first_name}!
            {user.is_premium && ' ⭐ Premium'}
          </p>
        )}
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
          {activeTab === 'init' && <InitDataDemo />}
          {activeTab === 'core' && <CoreApiDemo />}
          {activeTab === 'buttons' && <ButtonsDemo />}
          {activeTab === 'storage' && <StorageDemo />}
          {activeTab === 'haptics' && <HapticsDemo />}
          {activeTab === 'sensors' && <SensorsDemo />}
          {activeTab === 'biometrics' && <BiometricsDemo />}
          {activeTab === 'game' && <GameFeaturesDemo />}
          {activeTab === 'payments' && <PaymentsDemo />}
          {activeTab === 'data' && <DataCommDemo />}
          {activeTab === 'emoji' && <EmojiStatusDemo />}
          {activeTab === 'files' && <FileOperationsDemo />}
          {activeTab === 'activity' && <ActivityDemo />}
        </motion.div>
      </div>
    </main>
  )
}