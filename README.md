
# 🛍️FlockShop - Collaborative Wishlist App

A full-stack social wishlist app where users can create shared wishlists, add products, and collaborate in real-time — ideal for group shopping, gifting, or planning sprees.

---

## 📸 Screenshots

![Home Screenshot](public/home.png)
![Dashboard Screenshot](public/dashboard.png)


---

## 🚀 Features

- Smooth, intuitive onboarding to get users up and running fast
- Fully responsive layout, optimized for all devices
- Polished transitions and animations for a modern look and feel
- Add rich product details: name, image, price, and description
- Clearly track who added or edited each product (user attribution)
- Invite team members to collaborate on shared wishlists
- Modern dark mode + cyberpunk design theme 

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | Next.js + Tailwind CSS + Typescript + ShadCN      |
| Backend    | Node.js |
| Database   | MongoDB |
| Auth       | JWT + bcryptjs       |
| Hosting    | Vercel  |

---

## 🚀 Quick Start

### ✅ Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Git installed

### 🧱 Installation

```bash
git clone https://github.com/avni235/FlockShop.git
cd FlockSho
npm install
```

### ⚙️ Environment Setup

```bash
# Create environment file
cp .env.example .env.local
```

Add your environment variables in `.env.local`:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Environment
NODE_ENV=development
```

### 🔌 MongoDB Setup
- Create a MongoDB Atlas account & cluster (free tier)
- Create a database user
- Get the connection string and update `MONGODB_URI` in `.env.local`

### 🏃‍♀️ Run the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---


## 📁 Folder Structure (Simplified)

```
FlockShop/
├── app/                   # Next.js App Router
│   ├── api/               # Backend API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── wishlists/     # Wishlist CRUD operations
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication pages
│   ├── signup/
│   └── wishlist/          # Wishlist management
├── lib/                   # Utilities and database
│   ├── mongodb.ts         # Database connection
│   └── models/            # TypeScript interfaces
├── components/ui/         # Reusable UI components
├── hooks/                 # Custom React hooks
└── public/                # Static assets
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` – User registration
- `POST /api/auth/login` – User login
- `GET /api/auth/me` – Get current user
- `POST /api/auth/logout` – Logout

### Wishlists
- `GET /api/wishlists` – Fetch user wishlists
- `POST /api/wishlists` – Create wishlist
- `GET /api/wishlists/[id]` – View specific wishlist

### Products
- `POST /api/wishlists/[id]/products` – Add product
- `DELETE /api/wishlists/[id]/products/[productId]` – Remove product


---

## 📈 How I'd Improve or Scale

- Integrate proper access control for wishlists (only invited users can edit)
- Add image uploads via Firebase Storage
- Enable push notifications for reactions/comments
- Implement activity logs to track who added/edited what and when
- Add wishlist templates (e.g., “Birthday Gifts”, “Travel Essentials”) to speed up list creation
- Introduce categories and filters to better organize products
- Enable emoji-based filtering or sorting (e.g., “most loved” items)
- Add comment threads with reply functionality
- Offer an export to PDF or shareable link for wishlists
- Integrate smart suggestions based on previous wishlist behavior (AI-powered in the future)

---

## 📦 Submission

- Source Code: [GitHub Repo Link](https://github.com/avni235/FlockShop.git)
- Deployment: [Live App Link](https://wishlist-app.vercel.app/)

---

## 🙌 Author

**Avneet Kaur**  
[GitHub](https://github.com/avni235) • [LinkedIn](https://linkedin.com/in/avneet-kaur2)
