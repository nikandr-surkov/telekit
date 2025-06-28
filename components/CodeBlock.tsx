// components/CodeBlock.tsx
interface CodeBlockProps {
    children: string
    language?: string
}

export default function CodeBlock({ children, language = 'typescript' }: CodeBlockProps) {
    return (
        <div className="relative">
            <div className="absolute top-2 right-2 text-xs text-[var(--tg-theme-hint-color)]">
                {language}
            </div>
            <pre className="bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{children.trim()}</code>
            </pre>
        </div>
    )
}