# 🏟️ BuffTurf — Turf & Sports Ground Booking Platform

> A comprehensive, full-stack multi-role turf discovery and booking ecosystem designed for players, turf owners, and platform administrators. Built with a modern TypeScript stack as a final-year B.Tech capstone project.

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features by Role](#-key-features-by-role)
  - [1. Players & Regular Users](#1-players--regular-users)
  - [2. Turf Owners](#2-turf-owners)
  - [3. Platform Administrators](#3-platform-administrators)
- [Architecture & Concurrency Design](#-architecture--concurrency-design)
- [Technology Stack](#-technology-stack)
- [Database Schema (Prisma & MySQL)](#-database-schema-prisma--mysql)
- [Project Directory Structure](#-project-directory-structure)
- [API Route Reference](#-api-route-reference)
- [Environment Variables](#-environment-variables)
- [Local Setup & Installation](#-local-setup--installation)
- [Default Seed Accounts](#-default-seed-accounts)
- [Security & Engineering Best Practices](#-security--engineering-best-practices)
- [Future Enhancements](#-future-enhancements)

---

## 🌟 Project Overview

**BuffTurf** solves the fragmentation and manual friction in booking local athletic turfs (box cricket, football 5v5/7v7, badminton courts, tennis, volleyball, basketball). 

Traditionally, turf booking is conducted over chaotic phone calls and WhatsApp chats with no visibility into real-time availability, leading to double-bookings, payment disputes, and poor schedule management. 

BuffTurf delivers:
- **Instant Discovery & Slot Locking:** Real-time visibility into weekly schedules and automated conflict prevention using composite database constraints.
- **Three-Tier Role-Based Experience:** Dedicated workflows for End Users, Venue Owners, and System Admins.
- **End-to-End Operational Lifecycle:** From turf registration and verification to slot pricing, booking confirmation, reviews, dispute tickets, and revenue analytics.

---

## 🎯 Key Features by Role

### 1. Players & Regular Users
* **Smart Search & Filter:** Filter turfs by sport, city, user ratings, and pricing with instant debounced queries.
* **Interactive Day-by-Day Slot Picker:** Inspect daily time slots with visual indicators for booked vs. available slots.
* **Instant Booking & Mock Payment:** Transparent cost calculation and payment flow simulating real transactions.
* **Booking Management:** View active, completed, and cancelled bookings with cancellation capabilities.
* **Favorites & Wishlist:** Save preferred sports venues for 1-click access.
* **Verified Reviews & Ratings:** Leave ratings and feedback after completed matches to maintain platform quality.
* **In-App Notification Center:** Real-time updates for booking confirmations, cancellations, and support updates.
* **Dispute & Support Ticketing:** Submit complaints linked to venues with ticket status tracking (`OPEN`, `IN_PROGRESS`, `RESOLVED`).

### 2. Turf Owners
* **Turf Onboarding & Management:** Create detailed turf listings specifying address, city, geo-coordinates, supported sports, and amenities (Parking, Floodlights, Washrooms, Drinking Water, etc.).
* **Media Uploads:** Upload multi-image galleries powered by Cloudinary.
* **Recurring Time Slot Engine:** Configure customized slot durations, operational hours by day of the week (`0-6`), and peak/off-peak pricing.
* **Owner Dashboard:** Track daily bookings, upcoming matches, revenue figures, and mark completed sessions.
* **Dispute Center:** Review and respond to player complaints filed against their turf.
* **Performance Analytics:** Visual breakdown of revenue trends, popular sports, booking volume, and slot utilization.

### 3. Platform Administrators
* **Turf Verification & Moderation:** Review submitted venues and toggle status (`PENDING`, `APPROVED`, `REJECTED`) to ensure only legit grounds are publicly bookable.
* **User & Role Administration:** Inspect all registered accounts and promote/demote user roles (`USER`, `TURF_OWNER`, `ADMIN`).
* **Platform-Wide Audit:** Monitor all transactions, bookings, and platform revenue.
* **Complaint Escalation:** System-level resolution for complaints between players and turf owners.
* **System Analytics & CSV Exports:** Comprehensive system metrics and on-demand CSV export for external reporting.

---

## 🔒 Architecture & Concurrency Design

### Double-Booking Prevention (`activeKey`)
A frequent failure mode in booking engines is the race condition where two users book the same slot on the same date simultaneously. BuffTurf solves this at the database level:
- In `Booking`, an `activeKey` field is formatted as `${timeSlotId}#${bookingDate}` with a **`@unique`** database constraint.
- When an active booking is created, MySQL enforces atomicity: any concurrent attempt immediately triggers a `P2002` conflict and returns an HTTP `409 Conflict` error.
- If a booking is cancelled, the `activeKey` is set to `null`, instantly releasing the slot for subsequent bookings while preserving the historical audit log.

---

## 💻 Technology Stack

### Backend
| Technology | Role |
| :--- | :--- |
| **Node.js** | JavaScript runtime |
| **Express 5** | RESTful HTTP server |
| **TypeScript** | Static typing and interfaces |
| **Prisma ORM** | Type-safe query builder & migrations |
| **MySQL** | Relational data persistence |
| **JWT (JSON Web Token)** | Session tokens stored via secure HTTP-only cookies |
| **Bcrypt** | Salted password hashing |
| **Zod** | Schema validation for all HTTP request payloads |
| **Multer + Cloudinary** | Image handling and CDN cloud storage |
| **Helmet & CORS** | Security headers and cross-origin resource protection |
| **Express Rate Limit** | Request throttling for general APIs and brute-force mitigation on auth |

### Frontend
| Technology | Role |
| :--- | :--- |
| **React 19** | Component-driven user interface |
| **TypeScript** | Strict client-side typing |
| **Vite** | Fast modern build tool and dev server |
| **Tailwind CSS v4** | Custom athletic design system (pitch, turf, chalk palettes) |
| **React Router v7** | Single-page application routing with protected role gates |
| **React Hook Form + Zod** | Form validation and state management |
| **Axios** | HTTP client with automatic cookie credential transmission |
| **Oxlint** | High-performance linter |

---

## 🗄️ Database Schema (Prisma & MySQL)

The system is structured around 12 normalized models:

```mermaid
erDiagram
    User ||--o{ Turf : "owns"
    User ||--o{ Booking : "makes"
    User ||--o{ Review : "writes"
    User ||--o{ Favorite : "saves"
    User ||--o{ Notification : "receives"
    User ||--o{ Complaint : "submits"
    
    Turf ||--o{ TurfImage : "has"
    Turf ||--o{ TurfSport : "supports"
    Turf ||--o{ TurfFacility : "features"
    Turf ||--o{ TimeSlot : "schedules"
    Turf ||--o{ Booking : "hosts"
    Turf ||--o{ Review : "receives"
    Turf ||--o{ Favorite : "saved_by"
    
    Sport ||--o{ TurfSport : "categorizes"
    Sport ||--o{ Booking : "played_in"
    Facility ||--o{ TurfFacility : "equipped_at"
    
    TimeSlot ||--o{ Booking : "booked_in"
    Booking ||--o| Payment : "settled_by"
    Booking ||--o| Review : "evaluated_by"
```

### Models Summary
- `User`: Accounts with roles (`USER`, `TURF_OWNER`, `ADMIN`).
- `Sport`: Supported sports (Cricket, Football, Badminton, Basketball, Volleyball, Tennis).
- `Facility`: Amenities (Floodlights, Parking, Washroom, Drinking Water, etc.).
- `Turf`: Ground records with location, approval status (`PENDING`, `APPROVED`, `REJECTED`), and relations.
- `TurfSport` / `TurfFacility`: Many-to-many join tables.
- `TurfImage`: Uploaded Cloudinary images with primary thumbnail flag.
- `TimeSlot`: Weekly day-of-week slots (`dayOfWeek: 0-6`, start/end times, dynamic pricing).
- `Booking`: Scheduled session linked to user, slot, date, and atomic `activeKey`.
- `Payment`: Mock transaction record (`PENDING`, `SUCCESS`, `FAILED`) with transaction reference.
- `Review`: Verified 1-to-5 star rating and comment tied to a completed booking.
- `Favorite`: User-bookmarked turfs.
- `Notification`: User notifications with read/unread tracking.
- `Complaint`: Issue reporting (`OPEN`, `IN_PROGRESS`, `RESOLVED`).

---

## 📂 Project Directory Structure

```text
BuffTurf/
├── backend/
│   ├── prisma/
│   │   ├── migrations/             # MySQL schema migrations
│   │   ├── schema.prisma           # Prisma data models & relations
│   │   └── seed.ts                 # Initial sports, facilities & Admin seed
│   ├── src/
│   │   ├── config/                 # Environment and DB config (Prisma client)
│   │   ├── controllers/            # Request handlers (Turf, Booking, Auth, Admin, etc.)
│   │   ├── middleware/             # Auth, role guard, rate limit, upload, validation
│   │   ├── routes/                 # Express API routes
│   │   ├── services/               # Business logic, conflict checks & calculations
│   │   ├── utils/                  # ApiError, asyncHandler, JWT utilities
│   │   ├── validators/             # Zod input validation schemas
│   │   └── index.ts                # Express server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # Reusable UI, booking modals, reviews, navigation
│   │   ├── context/                # AuthContext & NotificationContext
│   │   ├── hooks/                  # Custom hooks (useDebounce, etc.)
│   │   ├── layouts/                # MainLayout, OwnerLayout, AdminLayout
│   │   ├── pages/                  # Public, User, Owner, and Admin views
│   │   │   ├── admin/              # Overview, Users, Turfs, Bookings, Analytics, Complaints
│   │   │   ├── auth/               # Login, Register
│   │   │   ├── owner/              # AddTurf, ManageSlots, Bookings, Analytics, Complaints
│   │   │   ├── Discovery.tsx       # Search & browse turfs
│   │   │   ├── TurfDetail.tsx      # Slot picker & booking
│   │   │   ├── MyBookings.tsx      # User reservations & status
│   │   │   └── Home.tsx            # Landing page
│   │   ├── services/api/           # Modular Axios API services
│   │   ├── App.tsx                 # Routing & role-based routes
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 📡 API Route Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user or turf owner | Public |
| `POST` | `/api/auth/login` | Authenticate & issue HTTP-only cookie | Public |
| `POST` | `/api/auth/logout` | Clear auth token cookie | Authenticated |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |
| `PATCH` | `/api/auth/me` | Update name or phone number | Authenticated |

### Turfs & Schedules (`/api/turfs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/turfs` | Search & filter turfs (sport, city, rating, sort) | Public |
| `GET` | `/api/turfs/sports` | List all available sports | Public |
| `GET` | `/api/turfs/facilities` | List all facilities | Public |
| `GET` | `/api/turfs/mine` | List all turfs owned by caller | Turf Owner |
| `GET` | `/api/turfs/:id` | Get turf details by ID | Public |
| `POST` | `/api/turfs` | Create a new turf profile | Turf Owner |
| `PUT` | `/api/turfs/:id` | Update turf details | Owner / Admin |
| `DELETE` | `/api/turfs/:id` | Delete turf | Owner / Admin |
| `GET` | `/api/turfs/:id/slots` | Get all configured time slots | Public |
| `GET` | `/api/turfs/:id/availability?date=YYYY-MM-DD` | Get availability for specific date | Public |
| `POST` | `/api/turfs/:id/slots` | Create recurring time slot | Turf Owner |
| `PATCH` | `/api/turfs/:id/slots/:slotId` | Update slot time, price, status | Owner / Admin |
| `DELETE` | `/api/turfs/:id/slots/:slotId` | Remove slot | Owner / Admin |
| `POST` | `/api/turfs/:id/images` | Upload image (Cloudinary) | Turf Owner |
| `DELETE` | `/api/turfs/:id/images/:imageId` | Delete image | Owner / Admin |

### Bookings & Payments (`/api/bookings`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Reserve a time slot (sets PENDING status) | Authenticated |
| `GET` | `/api/bookings` | List caller's bookings | Authenticated |
| `GET` | `/api/bookings/:id` | Get booking details | Authenticated |
| `PATCH` | `/api/bookings/:id/cancel` | Cancel booking (frees activeKey) | Owner / Admin / User |
| `POST` | `/api/bookings/:id/pay` | Simulate payment & set CONFIRMED | Authenticated |

### Owner Dashboard (`/api/owner`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/owner/dashboard` | Key performance indicators & summaries | Turf Owner |
| `GET` | `/api/owner/bookings` | Bookings across all owned turfs | Turf Owner |
| `PATCH` | `/api/owner/bookings/:id/complete`| Mark confirmed booking as completed | Turf Owner |

### Admin Dashboard (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Platform-wide metrics (users, turfs, revenue) | Admin |
| `GET` | `/api/admin/users` | List all registered users | Admin |
| `PATCH` | `/api/admin/users/:id/role` | Update user role (`USER`, `TURF_OWNER`, `ADMIN`) | Admin |
| `GET` | `/api/admin/turfs` | View all turfs (including pending/rejected) | Admin |
| `PATCH` | `/api/admin/turfs/:id/status` | Approve or reject turf | Admin |
| `GET` | `/api/admin/bookings` | Audit all bookings platform-wide | Admin |

### Complaints, Reviews, Favorites & Notifications
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/complaints` | File a complaint | Authenticated |
| `GET` | `/api/complaints/mine` | View personal tickets | Authenticated |
| `GET` | `/api/complaints/owner` | View tickets for owner's turfs | Turf Owner |
| `GET` | `/api/complaints/admin` | View all tickets platform-wide | Admin |
| `PATCH` | `/api/complaints/:id/status` | Update status (`OPEN`, `IN_PROGRESS`, `RESOLVED`) | Owner / Admin |
| `GET` | `/api/turfs/:id/reviews` | View turf reviews | Public |
| `POST` | `/api/turfs/:id/reviews` | Leave review for completed booking | Authenticated |
| `GET` | `/api/favorites` | Get user favorites | Authenticated |
| `POST` | `/api/favorites/:turfId` | Bookmark turf | Authenticated |
| `DELETE` | `/api/favorites/:turfId` | Remove bookmark | Authenticated |
| `GET` | `/api/notifications` | Get user notifications | Authenticated |
| `PATCH` | `/api/notifications/read-all`| Mark all notifications read | Authenticated |
| `GET` | `/api/analytics/export/bookings` | Download bookings CSV | Authenticated |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` based on `backend/.env.example`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/buffturf"
FRONTEND_URL="http://localhost:5173"
JWT_SECRET="super_secret_jwt_key_at_least_32_characters_long"
JWT_EXPIRES_IN="7d"

# Cloudinary (Required for image upload support)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) (v8.0+)
- npm or yarn

### 1. Database Setup
Ensure MySQL is running and create the database:
```sql
CREATE DATABASE buffturf;
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Apply database schema via Prisma migrations
npx prisma migrate dev --name init

# Seed database with initial sports, facilities, and admin account
npx prisma db seed

# Start development server with hot-reload
npm run dev
```
The backend will launch at `http://localhost:5000`.

### 3. Frontend Setup
```bash
# In a new terminal window, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will launch at `http://localhost:5173`.

---

## 👤 Default Seed Accounts

After running `npx prisma db seed`, the default Super Admin account is pre-configured:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@buffturf.com` | `admin123` | Full access to `/admin/*` dashboards |
| **Turf Owner** | *(Register via UI with role Turf Owner)* | User password | Access to `/owner/*` dashboards |
| **Player / User** | *(Register via UI with role User)* | User password | Standard booking experience |

---

## 🛡️ Security & Engineering Best Practices

1. **HttpOnly Cookie Authentication:** JWT credentials are stored in HTTP-only cookies to eliminate XSS token theft vectors.
2. **Payload Validation:** All request bodies and query parameters are strictly validated using `Zod` schemas prior to hitting controller logic.
3. **Input Sanitization:** Custom recursive middleware trims strings and escapes dangerous script tags to prevent stored HTML injection.
4. **Rate Limiting:** Multi-tier rate limiting via `express-rate-limit` (200 requests/15 min generally, strict 10 requests/15 min limit on `/auth` endpoints).
5. **Helmet Security Headers:** Configured Content Security Policies (`CSP`) restricting image origins to Cloudinary CDN and local storage.
6. **Graceful Error Handling:** Centralized `ApiError` class and global error handling middleware guaranteeing consistent, sanitized error responses without leaking stack traces in production.

---

## 🔮 Future Enhancements
- [ ] Integration with production payment gateways (Razorpay / Stripe / UPI webhooks).
- [ ] Automated TTL worker (e.g. BullMQ / Redis) to expire unpaid `PENDING` bookings after a 15-minute hold timeout.
- [ ] Automated refund processing on cancellation of paid bookings.
- [ ] Interactive Map interface (Leaflet / Google Maps API) for geolocated venue exploration.
- [ ] SMS / WhatsApp booking reminders via Twilio or WhatsApp Business API.

---

## 📄 License
This project is developed for educational and academic capstone demonstration purposes.