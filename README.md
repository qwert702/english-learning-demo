# 🎧 English Learning — Demo

> A simplified, open-source **English Listening & Reading** learning platform built with Next.js.

## ✨ Features

- 📖 **Listening & Reading** — Graded articles (A1-C2), three modes: Extra, Textbook, Exam
- 📝 **Exam Mode** — Simulated English test papers with auto-grading, multi-grade support (Grade 1-6)
- 📊 **Study Dashboard** — Daily check-in, learning calendar heatmap, streak tracking
- 🔐 **User Auth** — Email/password login & registration
- ⚙️ **Settings** — Profile update, password change
- 🔧 **Admin Panel** — Article CRUD, feature toggle management

## 🛠️ Tech Stack

| Category | Technology |
| -------- | ---------- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, RSC) |
| **Language** | TypeScript 5 (strict mode) |
| **UI** | Tailwind CSS v4 + shadcn/ui |
| **Database** | Prisma 7 + SQLite |
| **Auth** | NextAuth v5 (JWT, Credentials) |

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd english-learning-demo

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# 5. Seed data (sample article + exam paper + admin account)
npx tsx prisma/seed.ts

# 6. Start dev server
npm run dev
```

Visit **http://localhost:3000** in your browser.

### Admin Account

```
Email:    admin@demo.com
Password: admin123
```

## 📂 Project Structure

```
├── prisma/           # Database schema & seed data
├── public/           # Static assets
├── src/
│   ├── actions/      # Server Actions (auth, admin)
│   ├── app/
│   │   ├── (auth)/   # Login & Register
│   │   ├── (dashboard)/ # Protected study pages
│   │   ├── (admin)/  # Admin panel
│   │   └── api/      # Route handlers
│   ├── components/   # Shared UI components
│   └── lib/          # Core libraries (auth, prisma, errors)
├── middleware.ts      # Route protection + security headers
└── next.config.ts    # Next.js configuration
```

## 📄 License

MIT

---

# 🎧 English Learning — 展示版

> 一个简化的开源 **英语听力阅读** 学习平台，基于 Next.js 构建。

## ✨ 功能特色

| 功能 | 说明 |
|:----|:------|
| 📖 **听力阅读** | A1-C2 分级文章，支持课外/教材/实战三种模式 |
| 📝 **实战模式** | 模拟英语试卷（含听力选择、对话选择、语法填空、阅读理解），自动批改 |
| 📊 **学习首页** | 每日打卡、学习热力图、连胜记录 |
| 🔐 **用户认证** | 邮箱密码登录与注册 |
| ⚙️ **设置** | 修改昵称、修改密码 |
| 🔧 **管理后台** | 文章增删改查、功能开关管理 |

## 🛠️ 技术栈

| 类别 | 技术 |
|:----|:-----|
| **框架** | [Next.js 16](https://nextjs.org/) (App Router, RSC) |
| **语言** | TypeScript 5 (strict mode) |
| **UI** | Tailwind CSS v4 + shadcn/ui |
| **数据库** | Prisma 7 + SQLite |
| **认证** | NextAuth v5 (JWT, Credentials) |

## 🚀 快速开始

### 前置条件

- Node.js 20+
- npm

### 安装运行

```bash
# 1. 克隆仓库
git clone <你的仓库地址>
cd english-learning-demo

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env

# 4. 初始化数据库
npx prisma generate
npx prisma db push

# 5. 导入示例数据（1篇听力文章 + 1套一年级试卷 + 管理员账号）
npx tsx prisma/seed.ts

# 6. 启动开发服务器
npm run dev
```

浏览器打开 **http://localhost:3000** 即可访问。

### 管理员账号

```
邮箱:    admin@demo.com
密码:    admin123
```

## 📂 项目结构

```
├── prisma/           # 数据库 schema 和种子数据
├── public/           # 静态资源
├── src/
│   ├── actions/      # Server Actions（认证、管理）
│   ├── app/
│   │   ├── (auth)/   # 登录 & 注册
│   │   ├── (dashboard)/ # 学习中心（受保护路由）
│   │   ├── (admin)/  # 管理后台
│   │   └── api/      # 路由处理器
│   ├── components/   # 共享 UI 组件
│   └── lib/          # 核心库（auth, prisma, errors）
├── middleware.ts      # 路由保护 + 安全头
└── next.config.ts    # Next.js 配置
```

## 📄 许可证

MIT
