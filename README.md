# 🚀 Telegram Mini App Dev Kit

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Telegram-Mini_App-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram Mini App" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</div>

<br />

<div align="center">
  <h3>The most comprehensive open-source playground for Telegram Mini App development</h3>
  <p>17 interactive demos · 50+ production-ready code snippets · Full TypeScript support</p>
</div>

<br />

<div align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-demos">Demos</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</div>

---

## ⚡ Why This Project?

Building a **Telegram Mini App** shouldn't mean guessing how APIs work. This dev kit gives you a **live, interactive reference** for every Telegram WebApp API — from haptic feedback and biometric auth to Star payments and sensor access.

Whether you're building a **Telegram bot**, a **Web3 dApp on TON**, a **clicker game**, or a **full-stack SaaS inside Telegram**, this project shows you exactly how every feature works with copy-paste TypeScript code.

**Perfect for:**

- Developers building their first Telegram Mini App
- Teams evaluating Telegram as a distribution platform
- Hackathon participants who need working examples fast
- Anyone who learns best by reading real, working code

---

## 📦 Features

### 🔧 Developer Experience

- **Next.js 16 App Router** — latest React Server Components architecture
- **Full TypeScript** — complete type definitions for the entire Telegram WebApp API
- **Tailwind CSS 4** — utility-first styling with Telegram theme integration
- **Zustand** state management — lightweight, scalable global state
- **Framer Motion** animations — smooth, performant UI transitions
- **Prism syntax highlighting** — beautiful code blocks with copy-to-clipboard
- **Hot module replacement** — instant feedback during development

### 📱 Telegram API Coverage

| Category | Features |
|----------|----------|
| **Authentication** | Init data validation, HMAC-SHA256 verification, user identity |
| **UI Controls** | Main Button, Secondary Button, Back Button, Settings Button |
| **Payments** | Telegram Stars (XTR), invoices, refunds, webhooks |
| **Biometrics** | Face ID, Touch ID, fingerprint authentication |
| **Sensors** | Accelerometer, gyroscope, device orientation, GPS location |
| **Storage** | Cloud Storage (cross-device sync), key-value persistence |
| **Haptics** | Impact feedback (5 styles), notification feedback (3 types) |
| **Media** | QR code scanner, file downloads, camera/microphone permissions |
| **Sharing** | Story sharing with widgets, inline queries, URL sharing |
| **Theming** | Dynamic header/background/bottom bar colors, dark mode |
| **Game APIs** | Fullscreen, orientation lock, vertical swipe control |
| **Platform** | Home screen install, emoji status, version detection |

---

## 🎮 Demos

Every demo is interactive — open the app in Telegram, tap a button, and see the API in action.

| # | Demo | Description |
|---|------|-------------|
| 1 | **Init Data** | Validate Telegram authentication with HMAC-SHA256 |
| 2 | **Core API** | Platform info, fullscreen, theme, clipboard, permissions |
| 3 | **Buttons** | Main, Secondary, Back, and Settings button management |
| 4 | **Links** | External links, Telegram deep links, Instant View, browser selection |
| 5 | **Popups** | Alerts, confirms, multi-button popups, safe nesting patterns |
| 6 | **QR Scanner** | Scan and parse URLs, contacts, WiFi, game codes |
| 7 | **Storage** | Cloud Storage CRUD with game save/load example |
| 8 | **Haptics** | All impact and notification feedback types with patterns |
| 9 | **Sensors** | Accelerometer, gyroscope, device orientation, GPS |
| 10 | **Biometrics** | Face ID / fingerprint auth flow with token management |
| 11 | **Share Story** | Share images/videos to Telegram Stories with widget links |
| 12 | **Home Screen** | Add-to-home-screen prompt with status checking |
| 13 | **Emoji Status** | Set custom emoji status with duration control |
| 14 | **File Downloads** | Trigger native file downloads (images, videos, PDFs) |
| 15 | **Activity** | Track app activate/deactivate lifecycle events |
| 16 | **Game Features** | Fullscreen, orientation lock, swipe control + tap game |
| 17 | **Payments** | Complete Telegram Stars payment flow with backend examples |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- A **Telegram account**
- **ngrok** (free) for HTTPS tunneling during development

### 1. Clone and Install

```bash
git clone https://github.com/nikandr-surkov/telegram-mini-app-dev-kit.git
cd telegram-mini-app-dev-kit
npm install
```

### 2. Create a Telegram Bot

1. Open [@BotFather](https://t.me/botfather) in Telegram
2. Send `/newbot` and follow the prompts
3. Save your **bot token**

### 3. Configure Environment

```bash
cp .env.example .env.local
```

```env
# .env.local
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Start HTTPS Tunnel

Telegram requires HTTPS. In a separate terminal:

```bash
ngrok http 3000
```

Copy the `https://` URL from ngrok output.

### 6. Connect to Telegram

1. Go to [@BotFather](https://t.me/botfather) → `/mybots` → your bot
2. **Bot Settings** → **Menu Button** → **Edit Menu Button**
3. Paste your ngrok HTTPS URL
4. Open your bot in Telegram and tap the Menu button

---

## 📁 Project Structure

```
├── app/
│   ├── api/telegram/validate/    # Init data validation endpoint
│   ├── globals.css               # Telegram theme-aware styles
│   ├── layout.tsx                # Root layout with WebApp script
│   └── page.tsx                  # Main app with tab navigation
├── components/
│   ├── demos/                    # 17 interactive demo components
│   │   ├── InitDataDemo.tsx      # Authentication & validation
│   │   ├── CoreApiDemo.tsx       # Platform APIs & theming
│   │   ├── PaymentsDemo.tsx      # Telegram Stars integration
│   │   ├── BiometricsDemo.tsx    # Face ID / fingerprint auth
│   │   ├── SensorsDemo.tsx       # Accelerometer, gyroscope, GPS
│   │   └── ...                   # 12 more demos
│   ├── CodeBlock.tsx             # Syntax-highlighted code display
│   ├── ColorPicker.tsx           # Theme color picker component
│   ├── DemoSection.tsx           # Reusable demo layout wrapper
│   └── NavigationTabs.tsx        # Horizontal scrollable tabs
├── hooks/
│   ├── useCloudStorage.ts        # Async Cloud Storage wrapper
│   └── useHaptic.ts              # Haptic feedback helper hook
├── providers/
│   └── TelegramProvider.tsx      # React context for WebApp API
├── store/
│   └── telegram.ts               # Zustand global state
├── types/
│   └── telegram.d.ts             # Complete WebApp type definitions
└── utils/
    └── telegram.ts               # Validation & platform helpers
```

---

## 🔐 Init Data Validation

Every Telegram Mini App should validate init data on the backend. This project includes a working example:

```typescript
// app/api/telegram/validate/route.ts
import { validate, parse } from '@telegram-apps/init-data-node'

export async function POST(request: NextRequest) {
  const { initData } = await request.json()
  
  validate(initData, process.env.TELEGRAM_BOT_TOKEN!)
  const data = parse(initData)
  
  return NextResponse.json({ valid: true, user: data.user })
}
```

The `@telegram-apps/init-data-node` package handles HMAC-SHA256 signature verification against your bot token.

---

## 💳 Telegram Stars Payments

The Payments demo includes complete frontend and backend code for:

- Creating invoices via the Bot API
- Opening the native payment UI with `webApp.openInvoice()`
- Handling `pre_checkout_query` and `successful_payment` webhooks
- Processing refunds via `refundStarPayment`
- Testing strategies with minimal cost

All digital goods in Telegram Mini Apps must use **Telegram Stars** (`XTR` currency) per App Store and Play Store policies.

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on every push.

Set `TELEGRAM_BOT_TOKEN` in your Vercel project's environment variables.

After deploying, update your bot's Menu Button URL in BotFather to your production domain.

### Other Platforms

This is a standard Next.js 16 app — deploy anywhere that supports Node.js:

- **Railway** — `railway up`
- **Render** — connect GitHub repo
- **Fly.io** — `fly launch`
- **Docker** — `next build && next start`
- **AWS Amplify**, **Google Cloud Run**, **Azure App Service**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org) | React framework with App Router |
| [React 19](https://react.dev) | UI library |
| [TypeScript 5](https://typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS |
| [Zustand](https://zustand-demo.pmnd.rs) | Lightweight state management |
| [Framer Motion](https://motion.dev) | Animation library |
| [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer) | Syntax highlighting |
| [react-qr-code](https://github.com/rosskhanas/react-qr-code) | QR code generation |
| [@telegram-apps/init-data-node](https://github.com/Telegram-Mini-Apps/telegram-apps) | Server-side init data validation |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contributions

- Add new demo components for upcoming Telegram APIs
- Improve TypeScript type definitions
- Add unit tests with Vitest or Jest
- Create a dark/light theme toggle for the code blocks
- Add internationalization (i18n) support
- Write tutorials or blog posts about specific features
- Improve accessibility (a11y)
- Add E2E tests with Playwright

---

## 📚 Resources

**Telegram Documentation:**

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Stars Payments](https://core.telegram.org/bots/payments)
- [@BotFather](https://t.me/botfather) — create and manage bots

**Community & Learning:**

- 🌐 [nikandr.com](https://nikandr.com) — tutorials and courses
- 📺 [YouTube @NikandrSurkov](https://www.youtube.com/@NikandrSurkov) — video guides
- 💬 [Telegram @NikandrApps](https://t.me/NikandrApps) — community channel
- 💻 [GitHub @nikandr-surkov](https://github.com/nikandr-surkov) — open source projects

---

## 🐛 Troubleshooting

**Mini App not opening?**
- Verify ngrok is running and the HTTPS URL is correct
- Check your bot token in `.env.local`
- Make sure you set the Menu Button URL in BotFather (not just the bot description)

**"WebApp is not defined" error?**
- The app must be opened through Telegram, not a regular browser
- The `telegram-web-app.js` script loads only inside the Telegram client

**Features not working?**
- Some APIs require specific Telegram client versions (check the Version Check demo)
- Sensors require physical device — they won't work in Telegram Desktop
- Biometrics require device hardware support (Face ID, fingerprint scanner)

**Payment invoice not opening?**
- Ensure `provider_token` is empty string `""` for Stars payments
- Currency must be `"XTR"` for Telegram Stars
- Bot must have payment capability (check with BotFather)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this code in personal and commercial projects.

---

## ⭐ Star This Repo

If this project helped you build your Telegram Mini App, please give it a ⭐ on GitHub — it helps other developers discover it!

---

<div align="center">
  <p>Built by <a href="https://nikandr.com"><strong>Nikandr Surkov</strong></a></p>
  <p>
    <a href="https://nikandr.com">Website</a> •
    <a href="https://www.youtube.com/@NikandrSurkov">YouTube</a> •
    <a href="https://t.me/NikandrApps">Telegram</a> •
    <a href="https://github.com/nikandr-surkov">GitHub</a>
  </p>
</div>