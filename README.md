# Smart Retail POS — Frontend (API-connected)

This is your original frontend with full backend wiring added. UI/UX, components, and styling are unchanged — only the data layer was rewired from mock data to real API calls.

## Setup

```bash
npm install
```

`.env` is already created:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Make sure the backend is running first (see backend README — `npm run seed` then `npm run dev`), then:

```bash
npm run dev
```

## What changed

### New files
- `src/lib/api.js` — Axios instance with JWT auto-attach + 401 auto-logout
- `src/services/authService.js`
- `src/services/productService.js`
- `src/services/orderService.js`
- `src/services/inventoryService.js`
- `src/services/dashboardService.js`

### Rewired files
- `src/store/authStore.js` — login/register/forgot/reset now hit the real API; token persisted in localStorage; added `hydrate()` to re-validate session on app load
- `src/App.jsx` — calls `hydrate()` on mount, shows a loading screen until the token is verified
- `src/pages/auth/LoginPage.jsx` — removed hardcoded demo credentials (login now needs real seeded accounts)
- `src/pages/auth/ForgotPasswordPage.jsx` — calls real forgot-password endpoint, passes email to reset page
- `src/pages/auth/ResetPasswordPage.jsx` — calls real reset-password endpoint with email field
- `src/pages/products/ProductsPage.jsx` — full CRUD against `/api/products`
- `src/pages/pos/POSPage.jsx` — products load from API; "Complete & Print" / "Complete & Invoice" now call `/api/orders/checkout`, which atomically decrements stock and creates a real order
- `src/pages/inventory/InventoryPage.jsx` — inventory list + summary cards + Stock In/Out buttons wired to `/api/inventory`
- `src/pages/orders/OrdersPage.jsx` — order list + status updates wired to `/api/orders`
- `src/pages/dashboard/DashboardPage.jsx` — stat cards, revenue chart, sales channel chart, top products, recent transactions — all from real data
- `src/pages/reports/ReportsPage.jsx` — report highlights, revenue chart, top products from real data

### Unchanged (still local/client-side)
- `src/store/posStore.js` (cart state) — no change needed, already keys off `id` which POSPage now maps from MongoDB's `_id`
- `src/store/uiStore.js` — sidebar/search UI state, no backend involved

## Demo logins
Use the accounts created by the backend's `npm run seed`:
- `admin@smartretail.com` / `Admin@123`
- `manager@smartretail.com` / `Manager@123`
- `cashier@smartretail.com` / `Cashier@123`
