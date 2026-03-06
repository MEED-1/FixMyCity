# FixMyCity - Civic Engagement Platform

FixMyCity is a modern, full-stack civic engagement application designed to connect citizens with their local municipalities. It allows users to report urban issues, request community help, and track real-time issue resolutions via an interactive map.

![FixMyCity Dashboard](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000)

## 🌟 Key Features
* **Role-Based Workflows**: Tailored dashboards for Citizens, Local Agents, and System Administrators.
* **Geospatial Issue Tracking**: Interactive Leaflet maps for precise issue localization.
* **Photographic Proof of Resolution**: Agents must provide end-state photographs to close civic tickets.
* **Civic Crowdfunding**: Integrated Stripe Checkout for community donations and issue "boosting".
* **Fully Localized**: Seamlessly switch between English, French, and Arabic.
* **Real-time Notifications**: Updates powered by Laravel queues and local notifications.

---

## 🚀 Quick Start Guide

### Prerequisites
* **PHP 8.2+**
* **Node.js 18+**
* **MongoDB Atlas Cluster** (or local MongoDB with Replica Sets enabled)
* **Composer**

### 1. Backend Setup (Laravel 12)
Navigate to the backend directory:
```bash
cd fixmycity-backend
```

Install PHP dependencies:
```bash
composer install
```

Set up your environment variables by copying the example file:
```bash
cp .env.example .env
```
*Note: You must define your `MONGODB_URI` and any `STRIPE` / `CLOUDINARY` keys in your `.env` file before proceeding.*

Generate the application keys:
```bash
php artisan key:generate
php artisan jwt:secret
```

Seed the database with Categories, Municipalities, and Demo Users:
```bash
php artisan db:seed
```

Start the backend server:
```bash
php artisan serve
```

---

### 2. Frontend Setup (React / Vite)
Open a new terminal and navigate to the frontend directory:
```bash
cd fixmycity-frontend
```

Install NPM dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application will now be running at `http://localhost:5173`.

---

## 🔐 Demo Accounts
If you ran the seeders correctly, the following accounts are pre-configured:
* **Admin**: `admin@fixmycity.ma` (Password: `Admin1234`)
* **Agent**: `agent@fixmycity.ma` (Password: `Agent1234`)
* **Citizen**: `citizen@fixmycity.ma` (Password: `Citizen1234`)
