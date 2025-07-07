// components/demos/ShareStoryDemo.tsx
'use client'

import { useState } from 'react'
import { useTelegram } from '@/providers/TelegramProvider'
import DemoSection from '@/components/DemoSection'
import CodeBlock from '@/components/CodeBlock'

export default function ShareStoryDemo() {
    const { webApp } = useTelegram()
    const [customUrl, setCustomUrl] = useState('https://telegra.ph/file/5583ac37c90979f052b7b.png')
    const [storyText, setStoryText] = useState('Check out my achievement! 🎮')
    const [widgetUrl, setWidgetUrl] = useState('https://t.me/yourgamebot')
    const [widgetName, setWidgetName] = useState('Play Game')

    const sharePresets = [
        {
            title: 'Game Score',
            image: 'https://telegra.ph/file/5583ac37c90979f052b7b.png',
            text: '🎮 I just scored 10,000 points!',
            widget: { url: 'https://t.me/yourgamebot', name: 'Beat my score!' }
        },
        {
            title: 'Achievement',
            image: 'https://telegra.ph/file/5583ac37c90979f052b7b.png',
            text: '🏆 Level 100 Completed!',
            widget: { url: 'https://t.me/yourgamebot', name: 'Play Now' }
        },
        {
            title: 'Video Moment',
            video: 'https://telegra.ph/file/61f1dac694c3131a7b4ac.mp4',
            text: '🎬 Epic gameplay moment!',
            widget: { url: 'https://t.me/yourgamebot', name: 'Watch More' }
        }
    ]

    const shareBasicImage = () => {
        webApp?.shareToStory('https://telegra.ph/file/5583ac37c90979f052b7b.png')
    }

    const shareImageWithText = () => {
        webApp?.shareToStory(
            'https://telegra.ph/file/5583ac37c90979f052b7b.png',
            { text: storyText }
        )
    }

    const shareWithWidget = () => {
        webApp?.shareToStory(
            customUrl,
            {
                text: storyText,
                widget_link: {
                    url: widgetUrl,
                    name: widgetName
                }
            }
        )
    }

    const shareVideo = () => {
        webApp?.shareToStory(
            'https://telegra.ph/file/61f1dac694c3131a7b4ac.mp4',
            {
                text: '🎥 Amazing gameplay footage!',
                widget_link: {
                    url: 'https://t.me/yourgamebot',
                    name: 'Watch Full Video'
                }
            }
        )
    }

    return (
        <div className="space-y-6">
            <DemoSection title="📸 Share to Story">
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <h4 className="font-semibold mb-3">Quick Share Options</h4>

                        <div className="space-y-2">
                            <button onClick={shareBasicImage} className="btn-primary w-full">
                                Share Basic Image
                            </button>

                            <button onClick={shareImageWithText} className="btn-primary w-full">
                                Share Image with Caption
                            </button>

                            <button onClick={shareVideo} className="btn-primary w-full">
                                Share Video Story
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg">
                        <h4 className="font-semibold mb-3">Custom Story Builder</h4>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-[var(--tg-theme-hint-color)]">Media URL</label>
                                <input
                                    type="text"
                                    value={customUrl}
                                    onChange={(e) => setCustomUrl(e.target.value)}
                                    className="w-full p-2 mt-1 rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
                                    placeholder="Image or video URL"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-[var(--tg-theme-hint-color)]">Caption Text</label>
                                <input
                                    type="text"
                                    value={storyText}
                                    onChange={(e) => setStoryText(e.target.value)}
                                    className="w-full p-2 mt-1 rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
                                    placeholder="Story caption"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-[var(--tg-theme-hint-color)]">Widget Link URL</label>
                                <input
                                    type="text"
                                    value={widgetUrl}
                                    onChange={(e) => setWidgetUrl(e.target.value)}
                                    className="w-full p-2 mt-1 rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
                                    placeholder="Link URL"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-[var(--tg-theme-hint-color)]">Widget Button Text</label>
                                <input
                                    type="text"
                                    value={widgetName}
                                    onChange={(e) => setWidgetName(e.target.value)}
                                    className="w-full p-2 mt-1 rounded bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
                                    placeholder="Button text"
                                />
                            </div>

                            <button onClick={shareWithWidget} className="btn-primary w-full">
                                Share Custom Story
                            </button>
                        </div>
                    </div>
                </div>

                <CodeBlock language="typescript">
                    {`// Basic image share
webApp.shareToStory('https://example.com/image.png')

// With caption
webApp.shareToStory(imageUrl, {
  text: 'Check out my score! 🎮'
})

// With interactive widget
webApp.shareToStory(mediaUrl, {
  text: 'Level completed! 🏆',
  widget_link: {
    url: 'https://t.me/yourgamebot',
    name: 'Play Now'
  }
})

// Video story
webApp.shareToStory('https://example.com/video.mp4', {
  text: 'Epic moment! 🎥',
  widget_link: {
    url: 'https://t.me/yourgamebot/replay',
    name: 'Watch Replay'
  }
})`}
                </CodeBlock>
            </DemoSection>

            <DemoSection title="🎮 Game Integration Examples">
                <div className="space-y-3">
                    {sharePresets.map((preset, index) => (
                        <div
                            key={index}
                            className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded flex justify-between items-center"
                        >
                            <div>
                                <div className="font-semibold">{preset.title}</div>
                                <div className="text-sm text-[var(--tg-theme-hint-color)]">{preset.text}</div>
                            </div>
                            <button
                                onClick={() => {
                                    const mediaUrl = preset.image || preset.video || ''
                                    webApp?.shareToStory(mediaUrl, {
                                        text: preset.text,
                                        widget_link: preset.widget
                                    })
                                }}
                                className="btn-primary px-4 py-2"
                            >
                                Share
                            </button>
                        </div>
                    ))}
                </div>
            </DemoSection>

            <DemoSection title="💡 Best Practices">
                <div className="space-y-3">
                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">📏 Media Requirements</h4>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] mt-1 space-y-1">
                            <li>• Images: 1080x1920px (9:16 ratio)</li>
                            <li>• Videos: Max 30 seconds, MP4 format</li>
                            <li>• File size: Under 50MB</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded">
                        <h4 className="font-semibold">✨ Engagement Tips</h4>
                        <ul className="text-sm text-[var(--tg-theme-hint-color)] mt-1 space-y-1">
                            <li>• Use eye-catching visuals</li>
                            <li>• Add compelling call-to-action</li>
                            <li>• Include game achievements or scores</li>
                            <li>• Make widget links contextual</li>
                        </ul>
                    </div>
                </div>
            </DemoSection>
        </div>
    )
}