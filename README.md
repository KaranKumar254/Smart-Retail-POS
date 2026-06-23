# 🛒 Smart-Retail-POS

> Smart Billing. Seamless Inventory. Powerful Retail Management.

Smart-Retail-POS is a modern **Omnichannel Retail POS & Inventory Management System** built with the MERN Stack. It helps businesses manage products, billing, inventory, orders, sales analytics, and multi-role access from a single platform.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT Authentication
- Role-Based Access Control (RBAC)
- Admin, Manager & Cashier Roles
- Secure Password Hashing with bcrypt

### 📊 Dashboard
- Total Sales
- Total Orders
- Revenue Analytics
- Top Selling Products
- Recent Transactions
- Low Stock Alerts

### 📦 Product Management
- Add Products
- Edit Products
- Delete Products
- Search Products
- Category Filters
- Product Images
- SKU & Barcode Support

### 🛒 POS Billing System
- Fast Product Search
- Add to Cart
- Quantity Controls
- Discount Support
- GST Calculation
- Cash / Card / UPI Payment
- Invoice Generation
- Printable Receipt

### 📈 Inventory Management
- Real-Time Stock Updates
- Low Stock Alerts
- Inventory Logs
- Multi-store Inventory Support

### 📑 Orders Management
- Order History
- Order Details
- Order Status Tracking

### 📉 Reports & Analytics
- Daily Sales Reports
- Monthly Revenue Reports
- Product Performance
- Export CSV/PDF

---

# 🛠 Tech Stack

## Frontend
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- Recharts
- React Hot Toast

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- Socket.io
- Redis

## Database
- MongoDB Atlas
- Mongoose

## DevOps
- Docker
- GitHub Actions
- AWS / Vercel

---

# 📁 Project Structure

```bash
Smart-Retail-POS/

├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   ├── routes/
│   │   └── App.jsx
│   │
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── src/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │
│   └── app.js
│
├── server.js
├── package.json
└── .env
```

---

# ⚙️ Environment Variables

Create a `.env` file inside Backend.

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/Smart-Retail-POS_db

JWT_SECRET=RetailX@2026#SECRET

CLIENT_URL=http://localhost:5173
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone <your-repository-url>
```

---

## Backend Setup

```bash
cd Backend

npm install

npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔐 Authentication APIs

| Method | Endpoint |
|--------|-----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/profile |

---

# 📦 Product APIs

| Method | Endpoint |
|--------|-----------|
| POST | /api/products |
| GET | /api/products |
| PUT | /api/products/:id |
| DELETE | /api/products/:id |

---

# 🛒 Order APIs

| Method | Endpoint |
|--------|-----------|
| POST | /api/orders |
| GET | /api/orders |
| PATCH | /api/orders/:id |

---

# 📊 Inventory APIs

| Method | Endpoint |
|--------|-----------|
| GET | /api/inventory |
| POST | /api/inventory/update |

---

# 📈 Reports APIs

| Method | Endpoint |
|--------|-----------|
| GET | /api/reports/sales |
| GET | /api/reports/revenue |
| GET | /api/reports/products |

---

# 🔒 Security

- JWT Authentication
- bcrypt Password Hashing
- Role-Based Authorization
- Environment Variables
- Input Validation
- MongoDB Injection Protection
- CORS Enabled

---

# 📷 Screenshots

Add screenshots here:

- Login Page
- Dashboard
- POS Billing Screen
- Inventory Page
- Orders Page
- Reports Dashboard

---

# 🧠 Future Enhancements

- Barcode Scanner
- Multi-store Support
- AI Sales Prediction
- Cloudinary Image Upload
- Redis Caching
- Docker Deployment
- CI/CD Pipeline

---

# 👨‍💻 Author

**Karan Kumar**

### 🚀 RetailX
**Smart Billing. Seamless Inventory. Powerful Retail Management.**
