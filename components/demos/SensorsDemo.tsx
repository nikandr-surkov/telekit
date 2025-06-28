// components/demos/SensorsDemo.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function SensorsDemo() {
    const { webApp } = useTelegram()
    const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 })
    const [gyroscope, setGyroscope] = useState({ x: 0, y: 0, z: 0 })
    const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 })

    useEffect(() => {
        if (!webApp) return

        // Accelerometer
        webApp.onEvent('accelerometerChanged', function () {
            setAccelerometer({
                x: webApp.Accelerometer.x,
                y: webApp.Accelerometer.y,
                z: webApp.Accelerometer.z
            })
        })

        // Gyroscope
        webApp.onEvent('gyroscopeChanged', function () {
            setGyroscope({
                x: webApp.Gyroscope.x,
                y: webApp.Gyroscope.y,
                z: webApp.Gyroscope.z
            })
        })

        // Device Orientation
        webApp.onEvent('deviceOrientationChanged', function () {
            setOrientation({
                alpha: webApp.DeviceOrientation.alpha,
                beta: webApp.DeviceOrientation.beta,
                gamma: webApp.DeviceOrientation.gamma
            })
        })
    }, [webApp])

    const toggleAccelerometer = () => {
        if (webApp?.Accelerometer.isStarted) {
            webApp.Accelerometer.stop()
        } else {
            webApp?.Accelerometer.start({ refresh_rate: 60 })
        }
    }

    const toggleGyroscope = () => {
        if (webApp?.Gyroscope.isStarted) {
            webApp.Gyroscope.stop()
        } else {
            webApp?.Gyroscope.start({ refresh_rate: 60 })
        }
    }

    const toggleOrientation = () => {
        if (webApp?.DeviceOrientation.isStarted) {
            webApp.DeviceOrientation.stop()
        } else {
            webApp?.DeviceOrientation.start({ refresh_rate: 60 })
        }
    }

    return (
        <div className="space-y-6">
            <DemoSection title="📊 Accelerometer">
                <div className="space-y-4">
                    <button onClick={toggleAccelerometer} className="btn-primary w-full">
                        {webApp?.Accelerometer.isStarted ? 'Stop' : 'Start'} Accelerometer
                    </button>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg font-mono text-sm">
                        <div>X: {accelerometer.x.toFixed(3)}</div>
                        <div>Y: {accelerometer.y.toFixed(3)}</div>
                        <div>Z: {accelerometer.z.toFixed(3)}</div>
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
                        {webApp?.Gyroscope.isStarted ? 'Stop' : 'Start'} Gyroscope
                    </button>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg font-mono text-sm">
                        <div>X: {gyroscope.x.toFixed(3)}</div>
                        <div>Y: {gyroscope.y.toFixed(3)}</div>
                        <div>Z: {gyroscope.z.toFixed(3)}</div>
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
                        {webApp?.DeviceOrientation.isStarted ? 'Stop' : 'Start'} Orientation
                    </button>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg font-mono text-sm">
                        <div>Alpha: {orientation.alpha.toFixed(1)}°</div>
                        <div>Beta: {orientation.beta.toFixed(1)}°</div>
                        <div>Gamma: {orientation.gamma.toFixed(1)}°</div>
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
        </div>
    )
}