// 1. API Route: app/api/telegram/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validate, parse } from '@telegram-apps/init-data-node'

export async function POST(request: NextRequest) {
    const { initData } = await request.json()
    const botToken = process.env.TELEGRAM_BOT_TOKEN!

    try {
        // Validate the init data (throws if invalid)
        validate(initData, botToken)

        // Parse to get user info
        const data = parse(initData)

        return NextResponse.json({
            valid: true,
            user: data.user
        })
    } catch (error) {
        return NextResponse.json({
            valid: false,
            error: 'Invalid init data'
        }, { status: 401 })
    }
}