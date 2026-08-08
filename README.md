# 🌿 Kithula - Admin Management Portal

Welcome to the **Kithula Admin Management Portal**. This web application provides a secure, modern, and responsive dashboard designed for managing organic Kithul product catalogs, tracking customer orders, updating delivery statuses, and reviewing real-time sales metrics.

Built with **React**, **Vite**, **Tailwind CSS**, and integrated with a **FastAPI (PostgreSQL + AWS S3)** backend architecture.

---

## ✨ Features

- **🔒 Secure Authentication:**
  - Token-based login with support for both Email or Username.
  - JWT storage managed securely via `js-cookie` and `localStorage`.
  - Route guard protection (`AdminProtectedRoute`) ensuring secure access to administrative controls.

- **📊 Comprehensive Executive Dashboard:**
  - Dynamic KPI Summary Cards: *Total Orders*, *Pending*, *Processing*, and *Delivered*.
  - Monthly Order Analytics Bar Chart (Total vs. Delivered Orders).
  - Categorized Product Breakdown.
  - Lifetime Verified Delivered Revenue Metrics.
  - Recent Order Preview table with quick navigation shortcuts.

- **📦 Product Catalog Management:**
  - View all active products in a clean data table.
  - Add new products with image uploads directly sent to AWS S3.
  - Edit existing product details (name, description, price, stock, active status, image replacement).
  - Permanent product deletion with S3 image cleanup and reusable modal dialogs.

- **🛒 Order Processing & Fulfillment:**
  - View full list of customer orders with status filters (*ALL*, *Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
  - Quick inline status modification dropdowns.
  - Itemized Order Details Modal showing customer contacts, delivery destination, special notes, and item breakdown.
  - Order record deletion for finalized or cancelled orders.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18+
- **Build Tool / Bundler:** Vite
- **Styling:** Tailwind CSS + Custom CSS Theme Variables
- **Icons:** `react-icons` (FontAwesome / Feather)
- **HTTP Client:** Axios (with Interceptors for JWT authorization)
- **Notifications:** `react-toastify`
- **Routing:** React Router v6

---

## 📁 Project Structure

```text
src/
├── assets/                  # Brand images & logos
├── components/
│   └── admin/               # Reusable Admin Components
│       ├── AdminLayout.jsx          # Main layout wrapper with sidebar & navbar
│       ├── AdminNavbar.jsx          # Top navigation bar with active avatar & logout
│       ├── AdminProtectedRoute.jsx  # Route guard checking authentication state
│       ├── AdminSidebar.jsx         # Sticky navigation sidebar
│       └── DeleteConfirmModal.jsx   # Reusable confirmation popup modal
├── helpers/             # Authentication & API Utilities
│   ├── ApiClient.js         # Axios instance with auto-injected Bearer tokens
│   ├── auth.controller.js   # Sign-in & Sign-out handler logic
│   └── helpers/             # Cookie & LocalStorage persistence helpers
├── pages/
│   └── admin/               # Primary Admin Pages
│       ├── AdminDashboard.jsx       # Analytics & KPI overview
│       ├── AdminLogin.jsx           # Login credentials UI
│       ├── AdminOrders.jsx          # Order fulfillment & status manager
│       └── AdminProducts.jsx        # Product catalog CRUD management
└── controllers/                # Backend API Endpoints
    ├── order.controllers.js     # Order API calls
    └── product.controllers.js   # Product API calls