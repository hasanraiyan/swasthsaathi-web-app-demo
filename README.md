# 🩺 SwasthSaathi (स्वास्थ्य साथी)

A modern full-stack healthcare platform monorepo powered by **Turborepo**, **NestJS** (with **Mongoose** & **@clerk/express**), and **Expo** (supporting **Android**, **iOS**, and **Web**).

---

## 📁 Repository Structure

```
swasthsaathi/
├── apps/
│   ├── api/                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/           # Clerk Auth Guard & CurrentUser Decorator
│   │   │   ├── users/          # Users Module & Mongoose Schema
│   │   │   ├── app.module.ts   # Root Module with Mongoose & Config
│   │   │   └── main.ts         # Bootstrap with CORS & clerkMiddleware
│   │   └── package.json
│   │
│   └── mobile/                 # Expo React Native App (Android + Web + iOS)
│       ├── app/                # Expo Router File-based Navigation
│       │   ├── _layout.tsx     # ClerkProvider & Root Navigation Layout
│       │   └── index.tsx       # SwasthSaathi Home & Health Dashboard Screen
│       ├── src/lib/
│       │   └── token-cache.ts  # Cross-platform Secure Token Storage (SecureStore / Web)
│       ├── metro.config.js     # Monorepo-aware Metro bundler configuration
│       └── package.json
│
├── packages/
│   └── types/                  # Shared TypeScript interfaces & DTOs
│       ├── src/index.ts        # IUser, IPatientProfile, IApiResponse, etc.
│       └── package.json
│
├── .npmrc                      # Hoisted node-linker configuration for Expo Metro
├── pnpm-workspace.yaml         # PNPM Monorepo Workspace configuration
├── turbo.json                  # Turborepo task pipeline definition
├── .env.example                # Template environment variables
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v20+` or `v24+`
- **pnpm**: `v10+` (`npm i -g pnpm`)
- **MongoDB**: Local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 2. Environment Variables
Copy `.env.example` to `.env` (already done for development):
```bash
cp .env.example .env
```

Configure your **Clerk** credentials from [Clerk Dashboard](https://dashboard.clerk.com):
```env
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
MONGODB_URI=mongodb://127.0.0.1:27017/swasthsaathi
PORT=4000
EXPO_PUBLIC_API_URL=http://localhost:4000
```

### 3. Development Commands

Run both API and Mobile apps together:
```bash
pnpm dev
```

Or run individual apps:

- **NestJS API Only**:
  ```bash
  pnpm dev:api
  ```
  API runs on `http://localhost:4000` (`http://localhost:4000/health`).

- **Expo Mobile & Web**:
  ```bash
  pnpm dev:mobile
  ```
  - Press `w` in terminal to launch **Web browser**.
  - Press `a` in terminal to launch **Android Emulator / Device** via Expo Go.

- **Expo Prebuild (Native Android & iOS generation)**:
  ```bash
  pnpm prebuild:mobile
  ```
  This generates native `./android` and `./ios` project folders with Clerk native plugins and build properties configured.

- **Run Native Android directly**:
  ```bash
  pnpm android
  ```

- **Build all packages**:
  ```bash
  pnpm build
  ```

---

## 🔒 Authentication & API Integration

- **Backend**: Uses `@clerk/express` middleware in `apps/api/src/main.ts` with `ClerkAuthGuard` protecting endpoints (`/users/profile`, `/users/sync`).
- **Database**: Mongoose schemas under `apps/api/src/users/schemas/user.schema.ts` synced with Clerk User IDs.
- **Frontend**: `@clerk/clerk-expo` with cross-platform token caching supporting both native mobile (via `expo-secure-store`) and web browsers (via `localStorage`).
