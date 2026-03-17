# AlgorySoft Project

Welcome to the AlgorySoft Business Solutions platform. This project consists of a high-performance Next.js frontend and a Django-based backend.

## 🚀 Quick Start (Frontend)

The frontend is built with **Next.js 16 (Turbopack)**, **Redux Toolkit**, and **Framer Motion**.

### 1. Install Dependencies
Navigate to the `frontend` directory and install the required npm packages:
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🛠️ Backend Setup (Django)

The backend is built with **Django**.

### 1. Install Requirements
*Note: If a requirements.txt is missing, install the core dependencies:*
```bash
cd backend
pip install django django-cors-headers djangorestframework
```

### 2. Database Migrations
```bash
python manage.py migrate
```

### 3. Run Backend Server
```bash
python manage.py runserver
```

---

## 🔐 Admin Credentials

To access the **Admin Panel** (`/admin`), use the following credentials:

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Email:** `admin@algorysoft.com`
- **Admin Password:** `admin123`


🔑 To Activate Real Razorpay Payment Integration (Required Step)
Open 
.env.local
 and replace these two lines with your real keys from dashboard.razorpay.com:

RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

---

## ✨ Features Added
- **Minimalistic Admin UI:** All emojis replaced with professional `react-icons` (Feather Icons).
- **Dynamic Category Icons:** Over 100+ business-related icons available via a visual selector.
- **Project & Category Management:** Fully functional CRUD operations.
- **Real-time Pricing Engine:** Automated discount and tier calculation.
- **Smooth Animations:** Integrated Framer Motion and Swiper for premium UX.
