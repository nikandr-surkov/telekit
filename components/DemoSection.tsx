// components/DemoSection.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface DemoSectionProps {
    title: string
    children: ReactNode
}

export default function DemoSection({ title, children }: DemoSectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-bold flex items-center gap-2">
                {title}
            </h2>
            <div className="space-y-4">
                {children}
            </div>
        </motion.section>
    )
}