# Shwapner Thikana LTD - Frontend

🏗️ **Premium Real Estate Development Platform** - Frontend Application

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## 🎨 Live Demo

Coming soon after Vercel deployment!

## ✨ Features

- **Luxury Brand Design** - Premium gold, emerald, and royal blue color palette
- **Dark Mode** - Seamless theme switching with next-themes
- **Glass Morphism** - Modern UI with backdrop blur effects
- **Responsive Design** - Mobile-first approach
- **Premium Animations** - Smooth transitions and hover effects
- **SEO Optimized** - Server-side rendering with Next.js

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Custom Theme
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query
- **Dark Mode**: next-themes
- **Animations**: Framer Motion

## 🎨 Brand Colors

- **Luxury Gold**: `#F59E0B` - Premium highlights, CTAs
- **Emerald Green**: `#059669` - Growth, success, eco-luxury
- **Royal Blue**: `#2563EB` - Innovation, information
- **Dark Mode**: Deep Charcoal `#0F172A` backgrounds

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── layout.js     # Root layout with theme provider
│   ├── page.js       # Homepage
│   └── globals.css   # Global styles & theme
├── components/       # Reusable components
│   ├── theme-provider.jsx
│   └── theme-toggle.jsx
└── lib/              # Utilities
    └── utils.js      # Helper functions
```

## 🌍 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
NEXTAUTH_URL=your_frontend_url
NEXTAUTH_SECRET=your_nextauth_secret
```

## 📦 Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## 🎯 Features Roadmap

- [x] Luxury brand theme with dark mode
- [x] Responsive homepage
- [x] Theme toggle
- [x] Property listing page (Advanced Search & Filters)
- [x] Property detail page (Gallery, Maps, Nearby Places)
- [x] Interactive Drawing Map Search
- [x] Agent profiles & Dashboard
- [x] Concierge & Lead Management
- [x] Advanced Property Comparison
- [x] User Reviews & Rating System
- [x] Contact forms & Real-time Notifications
- [x] User authentication (JWT/NextAuth)
- [x] Performance Optimization (Next.js Image, Lazy Loading)

## 👥 Company

**Shwapner Thikana Ltd** (স্বপ্নের ঠিকানা)  
*Building Dreams, Creating Addresses*

Premium Real Estate Development Company  
Established: 2009  
Location: Dhaka, Bangladesh

## 📄 License

Private - © 2026 Shwapner Thikana Ltd

---

**Backend Repository**: [shwapner-Thikana-LTD-BackEnd](https://github.com/Tafsirchy/shwapner-Thikana-LTD-BackEnd)
