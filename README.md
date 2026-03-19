# AlgorySoft — Business Solutions Platform

> A full-stack web platform for showcasing, selling, and managing software solutions — built with **Next.js 16** (frontend) and **Django** (backend).

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
  - [Frontend Setup](#frontend-setup-nextjs)
  - [Backend Setup](#backend-setup-django)
- [Environment Variables](#-environment-variables)
- [Admin Panel](#-admin-panel)
- [Features](#-features)
- [Recent Changes](#-recent-changes)
- [Contact & Social](#-contact--social)

---

## 🧰 Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | React framework (App Router + Turbopack) |
| React | 19.2.3 | UI library |
| Redux Toolkit | ^2.11.2 | Global state management |
| Redux Persist | ^6.0.0 | State persistence across sessions |
| React Icons | ^5.5.0 | Icon library (Feather, Material, etc.) |
| Framer Motion | ^12.34.4 | Animations |
| Swiper | ^12.1.2 | Touch-friendly carousels |
| Axios | ^1.13.6 | HTTP client |
| React Hot Toast | ^2.6.0 | Notification toasts |
| next-auth | ^4.24.13 | Authentication |

### Backend
| Package | Purpose |
|---|---|
| Django | Web framework |
| Django REST Framework | REST API |
| Django CORS Headers | Cross-origin resource sharing |
| Django Channels | WebSocket / real-time support |
| Razorpay (Node SDK) | Payment gateway |

---

## 📁 Project Structure

```
AlgorySoft/
├── frontend/                  # Next.js 16 application
│   ├── app/
│   │   ├── admin/             # Admin dashboard (Berry-inspired UI)
│   │   ├── projects/[slug]/   # Project detail pages
│   │   ├── contact/           # Contact page
│   │   ├── cart/              # Shopping cart & checkout
│   │   └── ...
│   ├── store/
│   │   └── slices/            # Redux slices (products, cart, wishlist, etc.)
│   ├── components/            # Shared UI components (Navbar, Footer, etc.)
│   ├── hooks/                 # Custom React hooks (useRedux, useWebSocket)
│   └── lib/
│       └── data.ts            # Site-wide constants (contact info, social links)
│
├── backend/                   # Django REST API
│   ├── api/                   # REST endpoints (products, orders, requests, etc.)
│   ├── core/                  # ASGI config, routing, WebSocket consumers
│   └── manage.py
│
└── README.md
```

---

## 🚀 Quick Start

### Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build:**
```bash
npm run build
npm run start
```

---

### Backend Setup (Django)

#### 1. Create & activate virtual environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

#### 2. Install dependencies
```bash
pip install django djangorestframework django-cors-headers channels
```

#### 3. Apply migrations
```bash
python manage.py migrate
```

#### 4. Create a superuser (for Django Admin)
```bash
python manage.py createsuperuser
```

#### 5. Run the development server
```bash
python manage.py runserver 8000
```

Backend API is available at [http://localhost:8000](http://localhost:8000).

---

## 🔑 Environment Variables

Create a `.env.local` file inside the `frontend/` directory:

```env
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> ⚠️ **Important:** Replace the Razorpay placeholder values with your real keys from [dashboard.razorpay.com](https://dashboard.razorpay.com).

---

## 🔐 Admin Panel

Access the **Frontend Admin Dashboard** at:

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email:** `algorysoft@gmail.com`
- **Password:** `admin123`

Access the **Django Admin** at:

- **URL:** [http://localhost:8000/admin](http://localhost:8000/admin)
- Use the superuser credentials you created during setup.

---

## ✨ Features

### Client-Facing
- 🛍️ **Product Catalogue** — Browse software solutions with filtering, search, and category tags
- 📄 **Project Detail Pages** — Rich media gallery, tier-based pricing (Basic / Silver / Gold), tech stack display
- 🛒 **Cart & Checkout** — Multi-item cart with Razorpay payment integration (UPI, Cards)
- ❤️ **Wishlist** — Save projects for later
- ⭐ **Reviews** — Submit and display client reviews (admin-approved)
- 📋 **Free Quote Requests** — Share project requirements directly from product pages
- 💬 **WhatsApp Integration** — One-click WhatsApp contact button
- 🌐 **Currency Switcher** — INR / USD display toggle

### Admin Dashboard (Berry Design System)
- 📦 **Product Management** — Create, edit, and delete products with icon picker and image upload
- 🗂️ **Category Management** — Manage product categories
- 📥 **Order Management** — View and update order status
- 📨 **Free Quote Requests** — Review incoming client requirement submissions
- 👥 **User Management** — Manage registered users
- 💳 **Payments** — View transaction history
- ⭐ **Review Moderation** — Approve or reject submitted reviews
- 📡 **Real-time Updates** — WebSocket-based live data sync across sessions

---

## 🔄 Recent Changes

### Bug Fixes
- **`FiSettings` / `FiCpu` ReferenceError** — Added missing `react-icons/fi` imports to `app/projects/[slug]/page.tsx`.
- **Product Creation 400 Error** — Fixed `ProjectSerializer` to correctly handle `category` as an ID and mapped `productsSlice` for consistent backend submission.
- **WebSocket Connection Errors** — Debugged and stabilised ASGI/Channels configuration and frontend `useWebSocket` hook for reliable real-time sync.
- **API Connectivity** — Resolved routing issues for orders, free quotes, communication, and payment endpoints.
- **Admin Panel Data Sync** — Ensured client-side actions (orders, requests) are committed to the database and reflected in the admin view without stale cache.

### UI / Design Updates
- **Berry Design System Integration** — Admin dashboard redesigned to match Berry template aesthetic (cards, tables, sidebar, buttons).
- **Project Detail Page — Tech Stack Section** — Premium card layout with `FiCpu` and `FiSettings` icons, hover animations, and Berry-style typography.
- **Footer Cleanup** — Removed YouTube and Blog links from the footer.
- **Contact Information** — Updated to official AlgorySoft email, phone, WhatsApp, Instagram, and LinkedIn.
- **Feather Icons in Admin** — All emoji-based iconography in the admin panel replaced with professional Feather Icons from `react-icons/fi`.

### New Features
- **Razorpay Payment Gateway** — Full integration supporting UPI and Credit/Debit cards with live API keys, success/failure callbacks, and transaction storage.
- **Tier-Based Pricing** — Basic / Silver / Gold pricing tiers on every product detail page with animated selection UI.
- **Requirement Modal** — Auto-opens after 4 seconds on project detail pages, allowing clients to submit custom requirements.
- **Review System** — Clients can submit reviews; admin can approve or reject them.
- **Feature Add-ons** — Clients can select additional features from a catalogue when submitting requirements.

---

## 📞 Contact & Social

| Channel | Details |
|---|---|
| 🌐 Website | [algorysoft.com](https://algorysoft.com) |
| 📧 Email | algorysoft@gmail.com |
| 💬 WhatsApp | [+91 78995 33525](https://wa.me/917899533525) |
| 📸 Instagram | [@algorysoft](https://www.instagram.com/algorysoft) |
| 💼 LinkedIn | [AlgorySoft](https://www.linkedin.com/company/algorysoft) |

---

**Last Updated:** March 2026
