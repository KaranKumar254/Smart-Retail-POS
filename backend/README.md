# Smart Retail POS — Backend

Node.js + Express + MongoDB (Mongoose) + JWT backend built to match the Smart Retail POS React frontend exactly — same data shapes, same roles, same pricing logic (18% GST, 5% discount over ₹5000).

## Tech stack
- Express (ESModules)
- MongoDB + Mongoose
- JWT auth (Bearer token) with role-based access (Admin, Manager, Cashier)
- bcryptjs for password hashing

## Setup

```bash
cd smart-retail-pos-backend
npm install
```

1. Make sure MongoDB is running locally (`mongodb://localhost:27017`).
2. `.env` is already created (copied from `.env.example`). Adjust if needed:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smart_retail_pos
   JWT_SECRET=smart_retail_pos_super_secret_change_this
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=http://localhost:5173
   ```
3. Seed the database with demo users, products, and a few sample orders:
   ```bash
   npm run seed
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
   API runs at `http://localhost:5000`.

## Demo logins (after seeding)

| Role    | Email                     | Password      |
|---------|---------------------------|---------------|
| Admin   | admin@smartretail.com     | Admin@123     |
| Manager | manager@smartretail.com   | Manager@123   |
| Cashier | cashier@smartretail.com   | Cashier@123   |

## API Reference

### Auth — `/api/auth`
| Method | Route | Access | Notes |
|---|---|---|---|
| POST | `/register` | Public | `{ name, email, password, role, store }` |
| POST | `/login` | Public | `{ email, password }` → `{ user, token }` |
| GET | `/me` | Private | Returns current user from token |
| POST | `/forgot-password` | Public | `{ email }` — demo only, no real email sent |
| POST | `/reset-password` | Public | `{ email, password }` — demo only, no token verification |

### Products — `/api/products` (all routes require auth)
| Method | Route | Access |
|---|---|---|
| GET | `/?search=&category=` | Any logged-in user |
| GET | `/top?limit=5` | Any |
| GET | `/barcode/:barcode` | Any |
| GET | `/:id` | Any |
| POST | `/` | Admin, Manager |
| PUT | `/:id` | Admin, Manager |
| DELETE | `/:id` | Admin, Manager |

### Orders — `/api/orders` (all routes require auth)
| Method | Route | Notes |
|---|---|---|
| GET | `/?status=` | List orders, optional status filter |
| GET | `/recent?limit=5` | Most recent orders |
| POST | `/checkout` | Body: `{ items: [{ productId, quantity }], customer, payment }`. Atomically decrements stock, logs inventory movement, creates the order. |
| GET | `/:id` | Single order |
| PUT | `/:id/status` | Body: `{ status }` — Pending / Processing / Completed / Cancelled |

### Inventory — `/api/inventory` (all routes require auth)
| Method | Route | Access |
|---|---|---|
| GET | `/` | Any — shaped for InventoryPage table |
| GET | `/summary` | Any — active warehouses, low-stock count, channel count |
| GET | `/:productId/logs` | Any — stock movement history |
| PUT | `/:productId/stock` | Admin, Manager — body: `{ delta, reason }` (+ve = stock in, -ve = stock out) |

### Dashboard / Reports — `/api/dashboard` (all routes require auth)
| Method | Route | Notes |
|---|---|---|
| GET | `/stats` | Today's sales, total orders, revenue, low stock alerts |
| GET | `/revenue?months=8` | Monthly revenue trend for the area chart |
| GET | `/sales-channel` | Payment-method split for the donut chart |
| GET | `/report-highlights` | Daily / weekly / monthly revenue + inventory value |

## Notes
- All protected routes expect `Authorization: Bearer <token>`.
- Checkout uses a MongoDB transaction to keep stock decrement + order creation atomic.
- Forgot/reset password are intentionally simple (no email service) per project scope — wire up a real email provider (e.g. Nodemailer + SMTP) later if needed.
