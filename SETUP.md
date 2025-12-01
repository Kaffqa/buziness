# Bizness - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bizness/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard pages
│   │   ├── pos/           # Point of Sale
│   │   ├── inventory/     # Inventory management
│   │   ├── ai-tools/      # AI Tools suite
│   │   └── reports/       # Reports & File System
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirects to dashboard)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # UI components (Button, Card, etc.)
│   ├── sidebar.tsx        # Sidebar navigation
│   ├── header.tsx         # Top header
│   └── app-shell.tsx      # App shell wrapper
├── lib/                   # Utilities and stores
│   ├── store.ts           # Zustand store with persist
│   └── utils.ts           # Helper functions
└── package.json           # Dependencies

```

## Features Implemented

✅ **Dashboard** - Bento Grid layout with:
   - Business Health Score (0-100 gauge)
   - Revenue card with sparkline
   - Gamification system (Rank: Juragan Muda, etc.)
   - Quick Actions
   - Revenue trend chart

✅ **POS (Point of Sale)**
   - Product grid with images
   - Shopping cart with quantity controls
   - Checkout functionality
   - Automatic stock deduction
   - Receipt simulation

✅ **Inventory Management**
   - Smart table with search & filter
   - HPP Calculator with AI price suggestion
   - Low stock indicators (red highlight)
   - Add/Edit products

✅ **AI Tools**
   - Document Intelligence (OCR simulation)
   - Bizness Assistant (Context-aware chat)
   - Drag & drop file upload

✅ **Reports & File System**
   - MacOS Finder-style grid view
   - Create/Rename/Delete folders
   - File management UI

✅ **Multi-Business Support**
   - Business switcher in sidebar
   - Separate data per business
   - Seed data: Kopi Senja & Outfit Keren

## Data Persistence

All data is stored in browser LocalStorage using Zustand's persist middleware. This means:
- Products, sales, and inventory persist across page refreshes
- Data is business-specific
- No backend required for the prototype

## Design System

- **Colors**: Primary Indigo (#4F46E5), Success Emerald (#10B981)
- **Typography**: Inter font family
- **Components**: Shadcn/UI style components
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for data visualization

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Framer Motion (Animations)
- Recharts (Charts)
- Lucide React (Icons)

## Notes

- All pages are client components (`"use client"`) for interactivity
- Zustand store automatically seeds data on first load
- Business health score is calculated based on stock levels and sales activity
- AI price suggestion uses formula: `(Cost × 1.5)` rounded to nearest thousand

Enjoy your Bizness OS! 🚀


