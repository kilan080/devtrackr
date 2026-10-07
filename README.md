# DevTrackr 🚀

DevTrackr is a modern developer project tracking application built with **Next.js 15 App Router**, **Prisma ORM**, **Neon Serverless PostgreSQL**, **Clerk Authentication**, and **Framer Motion**.

It allows developers to document, organize, and showcase their ongoing software projects, track development milestones and progress percentages, stream activity feeds, and generate public developer profile portfolios.

---

## ✨ Features

- 🔐 **Authentication & User Management**: Powered by **Clerk Auth** (OAuth, magic links, user profiles, and session management).
- 📊 **Dynamic Project CRUD**: Full create, read, update, and delete functionality for developer projects.
- 📈 **Progress & Activity Tracking**: Real-time project completion sliders, activity feeds, and status indicators (`ACTIVE`, `COMPLETED`).
- ⚡ **Database & ORM**: **Prisma ORM** with **Neon Serverless PostgreSQL** database.
- 🎨 **Modern Interactive UI**: Sleek dark mode design powered by **Tailwind CSS** and smooth **Framer Motion** animations.
- 🌐 **Public Profiles**: Public developer profile pages (`/p/[username]`) and project share links (`/p/[username]/[projectId]`).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, API Routes)
- **Styling**: Tailwind CSS v4 & Framer Motion
- **Database**: PostgreSQL hosted on [Neon](https://neon.tech)
- **ORM**: Prisma Client v6
- **Auth**: Clerk (`@clerk/nextjs`)
- **Notifications**: React Hot Toast

---

## 📂 Data Model (Prisma Schema)

```prisma
model User {
  id        String    @id @default(cuid())
  clerkId   String    @unique
  email     String    @unique
  name      String?
  username  String    @unique
  projects  Project[]
  createdAt DateTime  @default(now())
}

model Project {
  id          String     @id @default(cuid())
  title       String
  description String?
  progress    Int        @default(0)   // 0 - 100%
  status      String     @default("ACTIVE") // ACTIVE | COMPLETED
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  activities  Activity[]
  createdAt   DateTime   @default(now())

  @@unique([title, userId])
}

model Activity {
  id        String   @id @default(cuid())
  content   String
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `pnpm` or `yarn`

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/devtrackr.git
cd devtrackr
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory:

```env
# Neon PostgreSQL Database Connection
DATABASE_URL="postgresql://user:password@ep-cool-db.region.aws.neon.tech/neondb?sslmode=require"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

### 4. Database Setup (Prisma & Neon)

Generate the Prisma client and sync the schema with your Neon database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📌 Available Scripts

- `npm run dev` - Starts Next.js development server
- `npm run build` - Builds production application bundle
- `npm run start` - Starts production server
- `npm run lint` - Runs ESLint code checks
- `npm run typecheck` - Runs TypeScript compiler check

---

## 📜 License

Distributed under the MIT License.
