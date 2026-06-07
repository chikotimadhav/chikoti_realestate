# 🏛️ Chikoti Real Estate — Full Stack Platform (MongoDB)

A complete real estate platform — **5 separate folders**, one shared MongoDB database, and a clean approval workflow.

---

## 📁 Project Structure

```
chikoti/
├── buyer-portal/      → www.chikotirealestate.com    (React + Vite, port 3001)
├── seller-portal/     → seller.chikotirealestate.com (React + Vite, port 3002)
├── admin-portal/      → admin.chikotirealestate.com  (React + Vite, port 3003)
├── backend/           → api.chikotirealestate.com    (Node.js + Express + MongoDB, port 5000)
└── shared/            → Constants, utils, API service (shared across portals)
```

---

## 🗄️ MongoDB Collections (Mongoose Models)

| Model       | File                          | Purpose                              |
|-------------|-------------------------------|--------------------------------------|
| `User`      | models/User.js                | Admins, sellers, buyers              |
| `Property`  | models/Property.js            | All listings with status workflow    |
| `Inquiry`   | models/Inquiry.js             | Buyer → Seller contact messages      |
| `Favorite`  | models/Favorite.js            | Saved properties per buyer           |

> No SQL schema import needed. MongoDB creates collections automatically. The default admin is seeded on first server start.

---

## ✅ Approval Flow

```
Seller Portal          MongoDB               Admin Portal
     │                    │                       │
     │  POST /properties  │                       │
     │──────────────────► │  status = "pending"   │
     │                    │ ◄─────────────────────│
     │                    │  PATCH status=approved │
     │                    │                       │
Buyer Portal              │
     │  GET /properties   │  (only approved shown)
     │──────────────────► │
```

---

## 🚀 Quick Start

### 1. Start Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set your MONGODB_URI
npm install
npm run dev
# → http://localhost:5000
# → Admin auto-seeded: admin@chikotirealestate.com / admin123
```

### 2. Start Portals (each in its own terminal)

```bash
cd buyer-portal  && npm install && npm run dev   # → :3001
cd seller-portal && npm install && npm run dev   # → :3002
cd admin-portal  && npm install && npm run dev   # → :3003
```

---

## 🔑 Demo Credentials

| Role   | Email                          | Password  |
|--------|--------------------------------|-----------|
| Admin  | admin@chikotirealestate.com   | admin123  |
| Seller | seller@test.com               | seller123 |

> The admin account is auto-created on first backend start.
> Register a seller account at seller portal → :3002

---

## 🌐 API Reference

### Auth
| Method | Endpoint           | Auth | Description     |
|--------|--------------------|------|-----------------|
| POST   | /api/auth/register | —    | Register user   |
| POST   | /api/auth/login    | —    | Login           |
| GET    | /api/auth/me       | ✅   | Current user    |

### Properties
| Method | Endpoint                         | Auth         | Description              |
|--------|----------------------------------|--------------|--------------------------|
| GET    | /api/properties                  | —            | Approved listings        |
| GET    | /api/properties/featured         | —            | Featured listings        |
| GET    | /api/properties/:id              | —            | Single property + view++ |
| GET    | /api/properties/seller/mine      | Seller/Admin | My listings              |
| POST   | /api/properties                  | Seller/Admin | Create (status=pending)  |
| DELETE | /api/properties/:id              | Seller/Admin | Delete own listing       |

### Inquiries
| Method | Endpoint              | Auth   | Description           |
|--------|-----------------------|--------|-----------------------|
| POST   | /api/inquiries        | —      | Send inquiry (buyer)  |
| GET    | /api/inquiries/seller | Seller | My property inquiries |

### Admin
| Method | Endpoint                            | Auth  | Description              |
|--------|-------------------------------------|-------|--------------------------|
| GET    | /api/admin/stats                    | Admin | Platform statistics      |
| GET    | /api/admin/properties?status=pending| Admin | Filter by status         |
| PATCH  | /api/admin/properties/:id/status    | Admin | Approve / Reject / Feature |
| GET    | /api/admin/users                    | Admin | All users                |
| PATCH  | /api/admin/users/:id                | Admin | Toggle active/verified   |
| GET    | /api/admin/inquiries                | Admin | All inquiries            |

---

## 🏗️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite                   |
| Styling    | Pure CSS (no framework)           |
| Maps       | Leaflet.js + OpenStreetMap        |
| Backend    | Node.js + Express                 |
| Database   | **MongoDB Atlas + Mongoose**      |
| Auth       | JWT + bcryptjs                    |
| Images     | Base64 → disk (or swap for S3)    |

---

## 🌍 Production Deployment

```bash
# Build all portals
cd buyer-portal  && npm run build
cd seller-portal && npm run build
cd admin-portal  && npm run build

# Serve with Nginx + PM2
pm2 start backend/src/server.js --name chikoti-api
```

```nginx
server {
  server_name api.chikotirealestate.com;
  location / { proxy_pass http://localhost:5000; }
}
server {
  server_name www.chikotirealestate.com;
  root /var/www/buyer-portal/dist;
  try_files $uri $uri/ /index.html;
}
```

---

*© 2024 Chikoti Real Estate. All rights reserved.*
