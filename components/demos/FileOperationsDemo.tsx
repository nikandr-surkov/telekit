// components/demos/FileOperationsDemo.tsx

/**
 * Telegram Dev Kit - Copyright (c) 2025 Nikandr Surkov
 * 
 * Proprietary License - This code may ONLY be used if purchased from https://nikandr.com
 * Redistribution, reselling, or public publishing is strictly prohibited.
 * 
 * Full license and contact: https://nikandr.com
 */

'use client'

import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function FileOperationsDemo() {
    const { webApp } = useTelegram()

    const downloadFile = (url: string, filename: string) => {
        webApp?.downloadFile(
            { url, file_name: filename },
            (downloaded: boolean) => {
                webApp.HapticFeedback.notificationOccurred(downloaded ? 'success' : 'error')
                webApp.showAlert(downloaded ? 'Download started!' : 'Download declined')
            }
        )
    }

    const files = [
        {
            name: 'Sample Image',
            url: 'https://telegra.ph/file/5583ac37c90979f052b7b.png',
            filename: 'sample-image.png'
        },
        {
            name: 'Sample Video',
            url: 'https://telegra.ph/file/61f1dac694c3131a7b4ac.mp4',
            filename: 'sample-video.mp4'
        },
        {
            name: 'Sample PDF',
            url: 'https://pdfobject.com/pdf/sample.pdf',
            filename: 'sample-document.pdf'
        }
    ]

    return (
        <div className="space-y-6">
            <DemoSection title="📥 File Downloads">
                <div className="space-y-3">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded"
                        >
                            <span>{file.name}</span>
                            <button
                                onClick={() => downloadFile(file.url, file.filename)}
                                className="btn-primary px-4 py-2"
                            >
                                Download
                            </button>
                        </div>
                    ))}
                </div>

                <CodeBlock language="typescript">
                    {`// Download file
webApp.downloadFile({
  url: 'https://example.com/file.pdf',
  file_name: 'document.pdf'
}, (downloaded) => {
  if (downloaded) {
    console.log('Download started')
  }
})`}
                </CodeBlock>
            </DemoSection>
        </div>
    )
}