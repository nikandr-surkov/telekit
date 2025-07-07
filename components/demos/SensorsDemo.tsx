// components/demos/SensorsDemo.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'
import type { LocationData } from '@/types/telegram'

export default function SensorsDemo() {
    const { webApp } = useTelegram()
    const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 })
    const [gyroscope, setGyroscope] = useState({ x: 0, y: 0, z: 0 })
    const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 })
    const [locationData, setLocationData] = useState<LocationData | null>(null)

    // Track sensor states
    const [isAccelerometerStarted, setIsAccelerometerStarted] = useState(false)
    const [isGyroscopeStarted, setIsGyroscopeStarted] = useState(false)
    const [isOrientationStarted, setIsOrientationStarted] = useState(false)

    useEffect(() => {
        if (!webApp) return

        // Initialize states
        setIsAccelerometerStarted(webApp.Accelerometer?.isStarted || false)
        setIsGyroscopeStarted(webApp.Gyroscope?.isStarted || false)
        setIsOrientationStarted(webApp.DeviceOrientation?.isStarted || false)

        // Initialize location manager
        webApp.LocationManager?.init()

        // Accelerometer
        const handleAccelerometerChange = () => {
            setAccelerometer({
                x: webApp.Accelerometer.x,
                y: webApp.Accelerometer.y,
                z: webApp.Accelerometer.z
            })
        }

        // Gyroscope
        const handleGyroscopeChange = () => {
            setGyroscope({
                x: webApp.Gyroscope.x,
                y: webApp.Gyroscope.y,
                z: webApp.Gyroscope.z
            })
        }

        // Device Orientation
        const handleOrientationChange = () => {
            setOrientation({
                alpha: webApp.DeviceOrientation.alpha,
                beta: webApp.DeviceOrientation.beta,
                gamma: webApp.DeviceOrientation.gamma
            })
        }

        webApp.onEvent('accelerometerChanged', handleAccelerometerChange)
        webApp.onEvent('gyroscopeChanged', handleGyroscopeChange)
        webApp.onEvent('deviceOrientationChanged', handleOrientationChange)

        // Cleanup
        return () => {
            webApp.offEvent('accelerometerChanged', handleAccelerometerChange)
            webApp.offEvent('gyroscopeChanged', handleGyroscopeChange)
            webApp.offEvent('deviceOrientationChanged', handleOrientationChange)
        }
    }, [webApp])

    const toggleAccelerometer = () => {
        if (webApp?.Accelerometer.isStarted) {
            webApp.Accelerometer.stop()
            setIsAccelerometerStarted(false)
            // Reset values when stopped
            setAccelerometer({ x: 0, y: 0, z: 0 })
        } else {
            webApp?.Accelerometer.start({ refresh_rate: 60 })
            setIsAccelerometerStarted(true)
        }
    }

    const toggleGyroscope = () => {
        if (webApp?.Gyroscope.isStarted) {
            webApp.Gyroscope.stop()
            setIsGyroscopeStarted(false)
            // Reset values when stopped
            setGyroscope({ x: 0, y: 0, z: 0 })
        } else {
            webApp?.Gyroscope.start({ refresh_rate: 60 })
            setIsGyroscopeStarted(true)
        }
    }

    const toggleOrientation = () => {
        if (webApp?.DeviceOrientation.isStarted) {
            webApp.DeviceOrientation.stop()
            setIsOrientationStarted(false)
            // Reset values when stopped
            setOrientation({ alpha: 0, beta: 0, gamma: 0 })
        } else {
            webApp?.DeviceOrientation.start({ refresh_rate: 60 })
            setIsOrientationStarted(true)
        }
    }

    const getLocation = () => {
        webApp?.LocationManager.getLocation((location: LocationData | null) => {
            if (location) {
                setLocationData(location)
                webApp.HapticFeedback.notificationOccurred('success')
            } else {
                webApp.showAlert('Location access denied')
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 <strong>Note:</strong> Sensors require Telegram v8.0+ and device permission.
                    Move your device to see values change.
                </p>
            </div>

            <DemoSection title="📊 Accelerometer">
                <div className="space-y-4">
                    <button onClick={toggleAccelerometer} className="btn-primary w-full">
                        {isAccelerometerStarted ? '⏹️ Stop' : '▶️ Start'} Accelerometer
                    </button>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg font-mono text-sm">
                        <div className={!isAccelerometerStarted ? 'opacity-50' : ''}>
                            <div>X: {accelerometer.x.toFixed(3)}</div>
                            <div>Y: {accelerometer.y.toFixed(3)}</div>
                            <div>Z: {accelerometer.z.toFixed(3)}</div>
                        </div>
                        {!isAccelerometerStarted && (
                            <p className="text-xs text-[var(--tg-theme-hint-color)] mt-2">
                                Press Start to begin reading sensor data
                            </p>
                        )}
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Accelerometer for motion controls
webApp.Accelerometer.start({ refresh_rate: 60 })

webApp.onEvent('accelerometerChanged', () => {
  const { x, y, z } = webApp.Accelerometer
  
  // Use for tilt controls
  player.velocity.x = x * sensitivity
  player.velocity.y = y * sensitivity
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🌀 Gyroscope">
                <div className="space-y-4">
                    <button onClick={toggleGyroscope} className="btn-primary w-full">
                        {isGyroscopeStarted ? '⏹️ Stop' : '▶️ Start'} Gyroscope
                    </button>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg font-mono text-sm">
                        <div className={!isGyroscopeStarted ? 'opacity-50' : ''}>
                            <div>X: {gyroscope.x.toFixed(3)}</div>
                            <div>Y: {gyroscope.y.toFixed(3)}</div>
                            <div>Z: {gyroscope.z.toFixed(3)}</div>
                        </div>
                        {!isGyroscopeStarted && (
                            <p className="text-xs text-[var(--tg-theme-hint-color)] mt-2">
                                Press Start to begin reading sensor data
                            </p>
                        )}
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Gyroscope for rotation
webApp.Gyroscope.start({ refresh_rate: 60 })

webApp.onEvent('gyroscopeChanged', () => {
  const { x, y, z } = webApp.Gyroscope
  
  // Use for 3D rotation
  camera.rotation.x += x * deltaTime
  camera.rotation.y += y * deltaTime
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="📐 Device Orientation">
                <div className="space-y-4">
                    <button onClick={toggleOrientation} className="btn-primary w-full">
                        {isOrientationStarted ? '⏹️ Stop' : '▶️ Start'} Orientation
                    </button>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg font-mono text-sm">
                        <div className={!isOrientationStarted ? 'opacity-50' : ''}>
                            <div>Alpha: {orientation.alpha.toFixed(1)}°</div>
                            <div>Beta: {orientation.beta.toFixed(1)}°</div>
                            <div>Gamma: {orientation.gamma.toFixed(1)}°</div>
                        </div>
                        {!isOrientationStarted && (
                            <p className="text-xs text-[var(--tg-theme-hint-color)] mt-2">
                                Press Start to begin reading sensor data
                            </p>
                        )}
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Device orientation for AR/VR
webApp.DeviceOrientation.start({ 
  refresh_rate: 60,
  need_absolute: true 
})

webApp.onEvent('deviceOrientationChanged', () => {
  const { alpha, beta, gamma } = webApp.DeviceOrientation
  
  // Use for AR camera view
  arCamera.setRotation(alpha, beta, gamma)
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="📍 Location">
                <div className="space-y-4">
                    <button onClick={getLocation} className="btn-primary w-full">
                        Get Current Location
                    </button>

                    {locationData && (
                        <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-[var(--tg-theme-hint-color)]">Latitude:</span>
                                    <div className="font-mono">{locationData.latitude.toFixed(6)}°</div>
                                </div>
                                <div>
                                    <span className="text-[var(--tg-theme-hint-color)]">Longitude:</span>
                                    <div className="font-mono">{locationData.longitude.toFixed(6)}°</div>
                                </div>
                                {locationData.altitude !== undefined && (
                                    <div>
                                        <span className="text-[var(--tg-theme-hint-color)]">Altitude:</span>
                                        <div className="font-mono">{locationData.altitude.toFixed(2)}m</div>
                                    </div>
                                )}
                                {locationData.speed !== undefined && (
                                    <div>
                                        <span className="text-[var(--tg-theme-hint-color)]">Speed:</span>
                                        <div className="font-mono">{locationData.speed.toFixed(2)}m/s</div>
                                    </div>
                                )}
                                {locationData.horizontal_accuracy !== undefined && (
                                    <div>
                                        <span className="text-[var(--tg-theme-hint-color)]">Accuracy:</span>
                                        <div className="font-mono">±{locationData.horizontal_accuracy.toFixed(0)}m</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <p className="text-sm text-[var(--tg-theme-hint-color)]">
                            Location data can be used for:
                        </p>
                        <ul className="text-sm mt-2 space-y-1">
                            <li>• Location-based games (AR, geocaching)</li>
                            <li>• Finding nearby players or items</li>
                            <li>• Weather-based game mechanics</li>
                            <li>• Distance tracking and achievements</li>
                        </ul>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Initialize location manager
webApp.LocationManager.init()

// Get one-time location
webApp.LocationManager.getLocation((location) => {
  if (location) {
    console.log('User location:', {
      lat: location.latitude,
      lng: location.longitude,
      accuracy: location.horizontal_accuracy
    })
    
    // Use for location-based features
    findNearbyPlayers(location)
    loadLocalWeather(location)
  } else {
    console.log('Location access denied')
  }
})

// Check permission status
if (webApp.LocationManager.isLocationAvailable) {
  // Location services are available
  if (webApp.LocationManager.isAccessGranted) {
    // Permission already granted
    getLocation()
  }
}`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}