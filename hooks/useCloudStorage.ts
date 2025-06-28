// hooks/useCloudStorage.ts
import { useState, useCallback } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'

export function useCloudStorage() {
    const { webApp } = useTelegram()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const setItem = useCallback(async (key: string, value: string): Promise<boolean> => {
        setLoading(true)
        setError(null)

        return new Promise((resolve) => {
            webApp?.CloudStorage.setItem(key, value, (err, stored) => {
                setLoading(false)
                if (err) {
                    setError(err.message)
                    resolve(false)
                } else {
                    resolve(stored || false)
                }
            })
        })
    }, [webApp])

    const getItem = useCallback(async (key: string): Promise<string | null> => {
        setLoading(true)
        setError(null)

        return new Promise((resolve) => {
            webApp?.CloudStorage.getItem(key, (err, value) => {
                setLoading(false)
                if (err) {
                    setError(err.message)
                    resolve(null)
                } else {
                    resolve(value || null)
                }
            })
        })
    }, [webApp])

    const removeItem = useCallback(async (key: string): Promise<boolean> => {
        setLoading(true)
        setError(null)

        return new Promise((resolve) => {
            webApp?.CloudStorage.removeItem(key, (err, removed) => {
                setLoading(false)
                if (err) {
                    setError(err.message)
                    resolve(false)
                } else {
                    resolve(removed || false)
                }
            })
        })
    }, [webApp])

    const getKeys = useCallback(async (): Promise<string[]> => {
        setLoading(true)
        setError(null)

        return new Promise((resolve) => {
            webApp?.CloudStorage.getKeys((err, keys) => {
                setLoading(false)
                if (err) {
                    setError(err.message)
                    resolve([])
                } else {
                    resolve(keys || [])
                }
            })
        })
    }, [webApp])

    return {
        setItem,
        getItem,
        removeItem,
        getKeys,
        loading,
        error
    }
}