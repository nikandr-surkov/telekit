// components/CodeBlock.tsx
import { Highlight, themes } from 'prism-react-renderer'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface CodeBlockProps {
    children: string
    language?: string
}

export default function CodeBlock({ children, language = 'typescript' }: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(children.trim())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative group">
            <div className="absolute top-2 right-2 flex gap-2 z-10">
                <span className="text-xs text-[var(--tg-theme-hint-color)] opacity-60">
                    {language}
                </span>
                <button
                    onClick={copyToClipboard}
                    className="px-2 py-1 text-xs bg-[var(--tg-theme-bg-color)] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>

            <Highlight
                theme={themes.github} // or themes.github, themes.vsDark, etc.
                code={children.trim()}
                language={language as any}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={`${className} p-4 rounded-lg overflow-x-auto text-sm`}
                        style={{
                            ...style,
                            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                        }}
                    >
                        <code>
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </div>
                            ))}
                        </code>
                    </pre>
                )}
            </Highlight>
        </div>
    )
}