// components/demos/StorageDemo.tsx

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

interface GameData {
    level: number
    score: number
    achievements: string[]
}

export default function StorageDemo() {
    const { webApp } = useTelegram()
    const [gameData, setGameData] = useState<GameData>({
        level: 1,
        score: 0,
        achievements: []
    })
    const [savedKeys, setSavedKeys] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const loadGameData = async () => {
        setLoading(true)
        webApp?.CloudStorage.getItem('gameData', (err, value) => {
            if (!err && value) {
                setGameData(JSON.parse(value))
            }
            setLoading(false)
        })
    }

    const saveGameData = async () => {
        const data = JSON.stringify(gameData)
        webApp?.CloudStorage.setItem('gameData', data, (err, stored) => {
            if (stored) {
                webApp.showAlert('Game saved!')
                webApp.HapticFeedback.notificationOccurred('success')
            }
        })
    }

    const loadAllKeys = () => {
        webApp?.CloudStorage.getKeys((err, keys) => {
            if (!err && keys) {
                setSavedKeys(keys)
            }
        })
    }

    useEffect(() => {
        if (webApp) {
            loadGameData()
            loadAllKeys()
        }
    }, [webApp])

    return (
        <div className="space-y-6">
            <DemoSection title="💾 Cloud Storage">
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <h4 className="font-semibold mb-2">Game Data</h4>
                        <div className="space-y-1 text-sm">
                            <div>Level: {gameData.level}</div>
                            <div>Score: {gameData.score}</div>
                            <div>Achievements: {gameData.achievements.join(', ') || 'None'}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setGameData(d => ({ ...d, level: d.level + 1 }))}
                            className="btn-primary"
                        >
                            Level Up
                        </button>

                        <button
                            onClick={() => setGameData(d => ({ ...d, score: d.score + 100 }))}
                            className="btn-primary"
                        >
                            Add Score
                        </button>
                    </div>

                    <button onClick={saveGameData} className="btn-primary w-full">
                        Save Game
                    </button>

                    <button onClick={loadGameData} className="btn-primary w-full" disabled={loading}>
                        {loading ? 'Loading...' : 'Load Game'}
                    </button>
                </div>

                <CodeBlock language="typescript">
                    {`// Save game data
const gameData = {
  level: 5,
  score: 1000,
  achievements: ['first_win', 'speed_run']
}

webApp.CloudStorage.setItem(
  'gameData', 
  JSON.stringify(gameData),
  (err, stored) => {
    if (stored) {
      console.log('Game saved!')
    }
  }
)

// Load game data
webApp.CloudStorage.getItem('gameData', (err, value) => {
  if (!err && value) {
    const gameData = JSON.parse(value)
    restoreGameState(gameData)
  }
})

// Get all saved keys
webApp.CloudStorage.getKeys((err, keys) => {
  console.log('Saved keys:', keys)
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🔑 Saved Keys">
                <div className="space-y-2">
                    {savedKeys.length > 0 ? (
                        savedKeys.map(key => (
                            <div key={key} className="p-2 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                                {key}
                            </div>
                        ))
                    ) : (
                        <p className="text-[var(--tg-theme-hint-color)]">No saved data</p>
                    )}
                </div>
            </DemoSection>
        </div>
    )
}