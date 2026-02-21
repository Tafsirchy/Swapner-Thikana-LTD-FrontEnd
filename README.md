# 🏗️ Shwapner Thikana LTD - Premium Real Estate Platform

> **Elevating Property Discovery with Innovation and Luxury.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)

---

## 🎯 Project Description

**Shwapner Thikana LTD (স্বপ্নের ঠিকানা)** is a sophisticated, full-stack real estate development platform designed to streamline the property discovery and management experience. Built with a focus on "Eco-Luxury," the platform combines a premium aesthetic with robust technical infrastructure. 

From interactive geospatial searches on the "Master Plan" to a multi-layered dashboard system for Customers, Agents, and Administrators, Shwapner Thikana provides a seamless end-to-end solution for modern real estate needs.

---

## 🎨 Live Demo
www.shwapnerthikana.com

## ✨ Implemented Features

### 🌐 Public Features
- **Luxury Landing Page**: 8+ immersive sections including hero gradients, promotional sliders, features showcase, and client testimonials.
- **Premium Property Browsing**: High-performance grid layout with advanced search and real-time filtering (Category, Area, Budget).
- **Interactive Master Plan**: Custom-drawn geospatial map search for intuitive property exploration.
- **Property Details**: Rich media galleries, detailed specifications, nearby locations, and agent contact integration.
- **Professional Blog/Magazine**: Content platform for real estate trends and company updates.
- **Tools**: Integrated Mortgage & Affordability calculators for users.

### 🔐 Authentication System
- **Multi-Provider Auth**: Hybrid system featuring JWT-based Credentials and Google OAuth 2.0.
- **Advanced Security**: Email verification, secure password reset, and rate-limited authentication endpoints.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Customers, Agents, Administrators, and Executive Management.
- **Session Management**: Persistent sessions with secure HTTP-only cookie integration via NextAuth.

### 👤 Dashboard & Role-Based Features
- **Customer Dashboard**: Manage saved properties (Wishlist), track saved searches with alerts, and view inquiry history.
- **Agent Dashboard**: Property listing management (CRUD), lead tracking, and performance analytics.
- **Admin/Management Hub**: 
  - **User Control**: Role assignment and account status management.
  - **Inventory Oversight**: Property approval/rejection workflows and "Featured" status control.
  - **System Health**: Analytics overview and email template configuration.

### 📱 Additional Features
- **Smart Notifications**: Real-time FCM (Firebase) notifications and SMTP email alerts for key events.
- **Automated Workflows**: Cron jobs for inquiry reminders and scheduled system maintenance.
- **Image Optimization**: Automatic AVIF/WebP conversion and multi-size thumbnail generation via Sharp.
- **Newsletter Engine**: Comprehensive subscription management with automated business notifications.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1 (App Router, Turbopack)
- **UI Library**: React 19.2 (Stable)
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **Animations**: Framer Motion + GSAP + Lenis (Smooth Scroll)
- **State/Data**: TanStack Query v5 + Axios
- **Forms/Validation**: React Hook Form + Zod

### Backend
- **Server**: Node.js & Express.js 4.21
- **Database**: MongoDB Atlas with Mongoose ORM
- **Auth Strategy**: Passport.js + JWT + bcryptjs
- **Media Handler**: Multer + Sharp + ImgBB API
- **Mailing**: Nodemailer (SMTP/Gmail)

### Development Tools
- **Package Manager**: npm
- **Security**: Helmet, CORS, Express-Rate-Limit
- **Logging**: Morgan
- **Infrastructure**: Vercel (Front-end), Cloud-managed Backend

---

## 📁 Project Structure

```text
STLTD/
├── real-estate-frontend/         # Next.js Application
│   ├── src/
│   │   ├── app/                 # App Router (Pages & Routes)
│   │   ├── components/          # Specialized UI Components
│   │   ├── lib/                 # Shared Utilities (Auth, API)
│   │   └── hooks/               # Custom React Hooks
│   ├── public/                  # Optimized Assets
│   └── tailwind.config.ts       # Design Tokens
│
└── real-estate-backend/          # Express API server
    ├── src/
    │   ├── models/              # Mongoose Schemas (User, Property, Lead)
    │   ├── routes/              # Express Endpoints
    │   ├── controllers/         # Business Logic
    │   ├── middlewares/         # Auth, Role, Upload guards
    │   └── utils/               # Helpers (JWT, Email, Image)
    └── server.js                # Server entry point
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm installed
- MongoDB Atlas cluster
- ImgBB API Key (for media)
- Google Cloud Console credentials (for OAuth)

### Step 1: Clone the Project
```bash
git clone https://github.com/Tafsirchy/shwapner-Thikana-LTD.git
cd STLTD
```

### Step 2: Configure Backend
```bash
cd real-estate-backend
npm install
# Configure .env with provided .env.example
npm run dev
```

### Step 3: Configure Frontend
```bash
cd real-estate-frontend
npm install
# Configure .env.local with provided .env.example
npm run dev
```

---

## 🗺️ Routes Summary

### Public Access
| Route | Description |
| :--- | :--- |
| `/` | Luxury Landing Page |
| `/properties` | Advanced Property Search |
| `/projects` | Major Development Listings |
| `/blog` | Industry Insights |
| `/contact` | Inquiry Submission |

### Protected Dashboard
| Route | Role Access | Feature |
| :--- | :--- | :--- |
| `/dashboard` | All | Overview Stats |
| `/dashboard/properties` | Agent/Admin | Inventory Control |
| `/dashboard/leads` | Agent/Admin | CRM Management |
| `/dashboard/admin/users`| Admin | User RBAC |

---

## 🔧 Development Workflow

- **Standard Flow**: Always run both servers simultaneously during development.
- **Building**: `npm run build` generates a production-optimized bundle via Turbopack.
- **Linting**: `npm run lint` ensures code consistency with specialized ESLint rules.

---

## 🌟 Future Enhancements
- [ ] AI-Powered property recommendations.
- [ ] 360-degree Virtual Tours integration.
- [ ] Real-time Chat (WebSockets) between Customers and Agents.
- [ ] Multi-currency and i18n support.

---

## 📄 License
Private - © 2026 Shwapner Thikana Ltd
