# 🚀 Telegram Dev Kit

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Telegram-Mini_App-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram" />
  <img src="https://img.shields.io/badge/Course-Bonus-gold?style=for-the-badge" alt="Course Bonus" />
</div>

<div align="center">
  <h3>The Ultimate Interactive Playground for Telegram Mini App Development</h3>
  <p>Learn, test, and implement every Telegram Mini App feature with production-ready code examples</p>
  <p><strong>🎉 Exclusive bonus project!</strong></p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [What's Included](#-whats-included)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)
- [Feature Demos](#-feature-demos)
- [Deployment](#-deployment)
- [Support](#-support)

## 🌟 Overview

**Telegram Dev Kit** is your comprehensive, interactive demonstration of all Telegram Mini App capabilities. This bonus project complements your Telegram mini app development course with hands-on, production-ready code examples.

### 🎯 Why This Project?

As a course student, you get exclusive access to:
- **17+ Live API Demos**: Test every Telegram feature in real-time
- **50+ Code Examples**: Copy-paste ready implementations
- **Production Patterns**: Learn best practices by example
- **Full TypeScript Support**: Complete type safety for all APIs
- **Beautiful UI/UX**: Professional design that adapts to Telegram themes

## 📦 What's Included

Your download contains:

```
telegram-dev-kit/
├── ✅ Full Next.js 15 application
├── ✅ 17 interactive demo components
├── ✅ Complete TypeScript definitions
├── ✅ Production-ready API examples
├── ✅ Payment integration templates
├── ✅ Sensor & biometric implementations
└── 📄 This comprehensive guide
```

## 📚 Prerequisites

Before starting, ensure you have:

- **Node.js** 18.0 or higher installed
- **npm** or **yarn** package manager
- **Telegram Account** for testing
- **ngrok account** (free) for HTTPS tunnel

## 🚀 Getting Started

### Step 1: Download and Extract

After clicking the **Download** button (top right), extract the project and open it in your code editor (VS Code recommended).

### Step 2: Install Dependencies

```bash
# Navigate to project folder
cd telegram-dev-kit

# Install all required packages
npm install
# or if you prefer yarn
yarn install
```

### Step 3: Create Telegram Bot

1. Open [@BotFather](https://t.me/botfather) in Telegram
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "My Dev Kit Bot")
4. Choose a username (must end with 'bot', e.g., "mydevkit_bot")
5. **Save your bot token** - you'll need it next!

### Step 4: Configure Environment

Create `.env.local` file in project root:

```env
# Required: Your bot token from BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### Step 5: Start Local Development

```bash
# Start the Next.js development server
npm run dev

# Your app is now running at http://localhost:3000
# But we need HTTPS for Telegram!
```

### Step 6: Set Up HTTPS Tunnel

Telegram requires HTTPS. Let's set up ngrok:

#### Create Free ngrok Account
1. Go to [ngrok.com](https://ngrok.com)
2. Click "Sign up" (it's free!)
3. Verify your email

#### Download and Configure ngrok
1. After login, go to [dashboard.ngrok.com/get-started/setup](https://dashboard.ngrok.com/get-started/setup)
2. Download ngrok for your operating system
3. Extract the file to any folder
4. **Windows**: Double-click `ngrok.exe` to open terminal
   **macOS/Linux**: Open terminal in the ngrok folder
5. Configure your auth token:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
   ```

#### Start ngrok Tunnel
```bash
# In the ngrok terminal window
ngrok http 3000

# You'll see:
# Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
#             ↑ COPY THIS URL! You'll need it for BotFather
```

**Important**: Keep this ngrok window open while developing!

### Step 7: Configure Your Bot

Now that you have your HTTPS URL, let's configure the bot:

1. Go back to [@BotFather](https://t.me/botfather)
2. Send `/mybots` and select your bot
3. Choose **Bot Settings**
4. Configure these settings:

#### Enable Inline Mode (for sharing features):
```
Bot Settings → Inline Mode → Turn on
```

#### Set Up Mini App:
```
Bot Settings → Menu Button → Edit Menu Button

Then choose:
→ Specify URL...
→ Enter your ngrok URL: https://abc123.ngrok-free.app
→ Enter button text: Open App
```

#### Alternative: Create Standalone Mini App:
```
/newapp
→ Select your bot
→ Enter title: Devkit
→ Enter description: Telegram Dev Kit Demo
→ Upload photo 640x360px
→ Upload demo GIF or send /empty to skip
→ Enter yout ngrok URL: https://abc123.ngrok-free.app
→ Enter short name: devkit
```

### Step 8: Test Your Mini App!

1. Open your bot in Telegram
2. You should see a **Menu** button (bottom left) or the button text you specified
3. Click it to open your Mini App
4. 🎉 Start exploring all the demos!

## 🎮 Running the App

### Development Workflow

You'll typically have 2 terminal windows open:

```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: ngrok tunnel
ngrok http 3000
```

### If ngrok URL Changes

When you restart ngrok, you'll get a new URL. Simply:
1. Copy the new HTTPS URL from ngrok
2. Go to @BotFather → `/mybots` → your bot → Bot Settings → Menu Button
3. Update with the new URL
4. If you have a standalone app, update it's URL via /myapps

## 📁 Project Structure

Understanding the codebase:

```
telegram-dev-kit/
├── 📁 app/                    # Next.js 15 app directory
│   ├── api/                   # API endpoints
│   │   └── telegram/          # Telegram-specific APIs
│   ├── globals.css            # Theme-aware styling
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main app entry
│
├── 📁 components/             
│   ├── demos/                 # All feature demos
│   │   ├── InitDataDemo.tsx   # Authentication demo
│   │   ├── CoreApiDemo.tsx    # Core features
│   │   ├── ButtonsDemo.tsx    # UI components
│   │   ├── PaymentsDemo.tsx   # Stars payments
│   │   ├── BiometricsDemo.tsx # Security features
│   │   └── ...12 more demos
│   └── ui/                    # Reusable components
│
├── 📁 hooks/                  # Custom React hooks
├── 📁 providers/              # Context providers
├── 📁 types/                  # TypeScript definitions
└── 📁 utils/                  # Helper functions
```

## 🎯 Feature Demos

### Core Features You'll Learn

#### 🔐 Authentication & Security
- Init data validation
- Biometric authentication
- Permission handling

#### 💳 Payments & Monetization
- Telegram Stars integration
- Invoice creation
- Refund handling
- Testing strategies

#### 🎨 UI/UX Capabilities
- Dynamic theming
- Haptic feedback
- Native popups
- Button management

#### 📱 Device Features
- Camera & QR scanning
- Location services
- Sensors (accelerometer, gyroscope)
- Clipboard access

#### 🎮 Gaming Features
- Fullscreen mode
- Orientation control
- Activity tracking
- Cloud save system

## 🚀 Deployment

### Option 1: Deploy via GitHub (Recommended)

1. **Create a PRIVATE GitHub Repository**
   
   ⚠️ **Important**: Always keep your repository private - it's a security best practice to never expose your app's internal logic and implementation details.
   
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `telegram-dev-kit`
   - **Select "Private"** - this is standard security practice
   - Don't initialize with README
   - Click "Create repository"

2. **Push Your Code**
   ```bash
   # Initialize git repository
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit"
   
   # Add your PRIVATE repository as origin
   git remote add origin https://github.com/yourusername/telegram-dev-kit.git
   
   # Push to GitHub (try main first, then master)
   git push -u origin main
   
   # If you get an error, use master instead:
   git push -u origin master
   ```

3. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - You may need to grant Vercel access to private repos
   - Import your private repository
   - Configure environment variables:
     - Add `TELEGRAM_BOT_TOKEN` with your bot token
   - Click "Deploy"

4. **Automatic Deployments**
   - Every push to `main` branch will trigger automatic deployment
   - Your code stays private, only the deployed app is public

### Option 2: Direct Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with one command
vercel

# Follow the prompts
# Set environment variables when prompted
```

### After Deployment

Update your bot to use the production URL:
1. Go to @BotFather → `/mybots` → your bot
2. Update Menu Button URL to your Vercel domain (e.g., `https://your-app.vercel.app`)
3. If you have a standalone app, update its URL via `/myapps`
4. Test everything works in production

> 💡 **Tip**: Vercel provides a stable URL for your app, no more ngrok URL changes!

> 🔒 **Security Best Practice**: Professional developers always keep their repositories private. This prevents potential security vulnerabilities and protects your implementation details. Users can access your app through Telegram without seeing how it works internally.

### After Deployment

Update your bot to use the production URL:
1. Go to @BotFather → `/mybots` → your bot
2. Update Menu Button URL to your production domain
3. If you have a standalone app, update it's URL via /myapps
4. Test everything works in production

## 💬 Support

### Getting Help & Stay Connected

Connect with me and the community through these channels:

- **🌐 Website**: [nikandr.com](https://nikandr.com) - Tutorials, articles, and resources
- **📺 YouTube**: [@NikandrSurkov](https://www.youtube.com/@NikandrSurkov) - Detailed video guides and walkthrough instructions
- **💬 Telegram Channel**: [@NikandrApps](https://t.me/NikandrApps) - Updates, text instructions and news
- **💻 GitHub**: [@nikandr-surkov](https://github.com/nikandr-surkov) - Open source projects and code examples

### Common Issues

**Mini App not opening?**
- Check ngrok is running and URL is correct
- Verify bot token in `.env.local`
- Make sure you're using HTTPS URL (not HTTP)

**"WebApp is not defined" error?**
- You must open the app through Telegram, not in a regular browser

**Features not working?**
- Some features require specific Telegram versions
- Check the demo page for version requirements

---

<div align="center">
  <h3>🎓 Happy Learning!</h3>
  <p>This project is your playground - experiment, break things, and learn!</p>
  <p>Remember: The best way to learn is by building.</p>
  <br/>
  <p><strong>© 2025 Nikandr Surkov</strong></p>
  <p>Part of the Telegram Mini Apps Mastery Course</p>
  <p><a href="https://nikandr.com">nikandr.com</a></p>
</div>