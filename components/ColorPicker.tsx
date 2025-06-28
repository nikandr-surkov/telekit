// components/ColorPicker.tsx
import { useState } from 'react'

interface ColorPickerProps {
    label: string
    value: string
    presets: { label: string; value: string }[]
    onChange: (color: string) => void
}

export default function ColorPicker({ label, value, presets, onChange }: ColorPickerProps) {
    const [isCustom, setIsCustom] = useState(false)

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => {
                        setIsCustom(true)
                        onChange(e.target.value)
                    }}
                    className="w-12 h-10 rounded cursor-pointer border-2 border-[var(--tg-theme-hint-color)]"
                />
                <select
                    value={isCustom ? 'custom' : value}
                    onChange={(e) => {
                        const newValue = e.target.value
                        if (newValue !== 'custom') {
                            setIsCustom(false)
                            onChange(newValue)
                        }
                    }}
                    className="flex-1 px-3 py-2 rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-hint-color)]"
                >
                    <option value="custom">Custom: {value}</option>
                    {presets.map(preset => (
                        <option key={preset.value} value={preset.value}>
                            {preset.label}
                        </option>
                    ))}
                </select>
                <div
                    className="w-10 h-10 rounded border-2 border-[var(--tg-theme-hint-color)]"
                    style={{ backgroundColor: value }}
                />
            </div>
        </div>
    )
}