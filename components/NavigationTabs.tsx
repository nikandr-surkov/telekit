// components/NavigationTabs.tsx
import { motion } from 'framer-motion'

interface Tab {
    id: string
    label: string
    icon: string
}

const tabs: Tab[] = [
    { id: 'init', label: 'Init Data', icon: '🔐' },
    { id: 'core', label: 'Core API', icon: '🔧' },
    { id: 'buttons', label: 'Buttons', icon: '🔘' },
    { id: 'links', label: 'Links', icon: '🔗' },
    { id: 'popups', label: 'Popups', icon: '💬' },
    { id: 'qr', label: 'QR Scanner', icon: '📷' },
    { id: 'storage', label: 'Storage', icon: '💾' },
    { id: 'haptics', label: 'Haptics', icon: '📳' },
    { id: 'sensors', label: 'Sensors', icon: '📱' },
    { id: 'biometrics', label: 'Biometrics', icon: '🔐' },
    { id: 'share', label: 'Share', icon: '📸' },
    { id: 'homescreen', label: 'Home', icon: '🏠' },
    { id: 'emoji', label: 'Emoji', icon: '😊' },
    { id: 'files', label: 'Files', icon: '📥' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'game', label: 'Game', icon: '🎮' },
    { id: 'payments', label: 'Payments', icon: '💰' },
]

interface NavigationTabsProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
    return (
        <nav className="bg-[var(--tg-theme-secondary-bg-color)] p-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${activeTab === tab.id
                                ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]'
                                : 'bg-transparent text-[var(--tg-theme-text-color)]'}
            `}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="mr-1">{tab.icon}</span>
                        {tab.label}
                    </motion.button>
                ))}
            </div>
        </nav>
    )
}