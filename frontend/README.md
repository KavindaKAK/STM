# Tyre Shop E-Commerce Platform

A full-stack e-commerce platform for a tyre shop in Beruwala, Sri Lanka, built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

## 🚀 Features

### Customer Features
- ✅ Browse tyres, batteries, and accessories with advanced filtering
- ✅ Product search and filtering by brand, price, size, specifications
- ✅ Shopping cart with persistent storage
- ✅ User registration and authentication (JWT-based)
- ✅ One-page checkout with district-based shipping
- ✅ Order history and tracking
- ✅ Product reviews and ratings
- ✅ Wishlist functionality
- ✅ Saved addresses management
- ✅ Dashboard with notifications

### Admin Features
- ✅ Complete product management (Create, Read, Update, Delete)
- ✅ Stock management and sales tracking
- ✅ Banner management for hero slider
- ✅ Brand management
- ✅ Shipping fee configuration (25 Sri Lankan districts)
- ✅ Order management and status updates
- ✅ Review moderation (approve/reject)
- ✅ Blog post management

### Technical Highlights
- ✅ Role-based authentication (Admin/Customer)
- ✅ Mongoose schemas with proper indexes
- ✅ Transaction support for checkout
- ✅ Automatic stock decrement and sales count increment
- ✅ Zod validation on all endpoints
- ✅ RESTful API design
- ✅ Server-side rendering with Next.js App Router
- ✅ Mobile-first responsive design
- ✅ TypeScript for type safety

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd STM
npm install
```

### 2. Environment Setup

Create `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tyre-shop?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@tyreshop.lk
ADMIN_PASSWORD=admin123
```

### 3. Seed the Database

```bash
npm run seed
```

This will:
- Create an admin user with the credentials from `.env.local`
- Set up shipping fees for all 25 Sri Lankan districts
- Create sample brands

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
STM/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── products/             # Public product endpoints
│   │   ├── cart/                 # Cart management
│   │   ├── checkout/             # Checkout process
│   │   ├── orders/               # Order endpoints
│   │   ├── reviews/              # Review endpoints
│   │   ├── brands/               # Brand listing
│   │   ├── banners/              # Banner listing
│   │   ├── shipping-fees/        # Shipping fee lookup
│   │   └── admin/                # Admin-only endpoints
│   │       ├── products/         # Product CRUD
│   │       └── orders/           # Order management
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/                          # Utilities
│   ├── db.ts                     # MongoDB connection
│   ├── auth.ts                   # Auth utilities (JWT, bcrypt)
│   └── utils.ts                  # Helper functions
├── models/                       # Mongoose Models
│   ├── User.ts
│   ├── Product.ts
│   ├── Cart.ts
│   ├── Order.ts
│   ├── Review.ts
│   ├── Brand.ts
│   ├── Banner.ts
│   ├── ShippingFee.ts
│   ├── BlogPost.ts
│   ├── Wishlist.ts
│   ├── Notification.ts
│   └── Invoice.ts
├── validators/                   # Zod Schemas
│   ├── auth.ts
│   ├── product.ts
│   ├── order.ts
│   └── review.ts
├── types/                        # TypeScript types
│   └── index.ts
├── scripts/                      # Utility scripts
│   └── seed.ts
└── package.json

```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login (admin or customer)
- `GET /api/auth/me` - Get current user

### Products (Public)
- `GET /api/products` - List products with filters
  - Query params: `type`, `brand`, `minPrice`, `maxPrice`, `inStock`, `width`, `profile`, `rim`, `sort`, `page`, `limit`
- `GET /api/products/[id]` - Get single product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update cart item quantity

### Checkout & Orders
- `POST /api/checkout` - Place order (authenticated)
- `GET /api/orders/my` - Get user's orders

### Reviews
- `POST /api/reviews` - Submit review (authenticated)
- `GET /api/reviews` - Get approved reviews

### Brands, Banners, Shipping
- `GET /api/brands` - List active brands
- `GET /api/banners` - List active banners
- `GET /api/shipping-fees` - List all district shipping fees

### Admin Endpoints (require admin role)
- `POST /api/admin/products` - Create product
- `GET /api/admin/products` - List all products
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/[id]/status` - Update order status

## 🗄️ Database Models

### User
- Role-based (admin/customer)
- Embedded addresses array
- Password hashing with bcrypt

### Product
- Discriminated specs for tyres/batteries/accessories
- Stock tracking
- Sales count for best sellers
- Discount support (percent or fixed)

### Cart
- Per-user cart with product snapshots
- Price and name snapshots preserve historical data

### Order
- Complete snapshot data
- Pricing breakdown (items, discount, shipping, total)
- Payment tracking (COD/Card)
- Order status workflow

### ShippingFee
- 25 Sri Lankan districts
- Configurable per district

## 🔐 Authentication Flow

1. User registers via `/api/auth/register`
2. Password is hashed with bcrypt (salt rounds: 10)
3. JWT token is generated and returned
4. Client stores token and sends it in `Authorization: Bearer <token>` header
5. Protected routes verify token via `getUserFromRequest()`
6. Admin routes additionally check `user.role === 'admin'`

## 🌍 25 Sri Lankan Districts

The system supports shipping fees for all distric ts:
- Colombo, Gampaha, Kalutara
- Kandy, Matale, Nuwara Eliya
- Galle, Matara, Hambantota
- Jaffna, Kilinochchi, Mannar, Vavuniya, Mullaitivu
- Batticaloa, Ampara, Trincomalee
- Kurunegala, Puttalam
- Anuradhapura, Polonnaruwa
- Badulla, Monaragala
- Ratnapura, Kegalle

## 🛍️ Checkout Process

1. Customer adds items to cart
2. Navigates to checkout (must be authenticated)
3. Selects shipping address and district
4. System calculates shipping fee based on district
5. On order placement:
   - Transaction starts
   - Stock is verified and decremented
   - Sales count is incremented
   - Order is created with auto-confirmed status (COD)
   - Cart is cleared
   - Notification is created
   - Transaction commits

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database
```

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Font**: Inter (Google Fonts)
- **Theme**: 
  - Primary: Dark Blue (#1E3A8A)
  - Accent: Blue (#3B82F6)
  - Background: Gray (#F9FAFB)

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure these are set in your deployment platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`

## 📝 To-Do / Future Enhancements

The following features are planned but not yet implemented:

- [ ] Complete frontend pages (Home, Tyres, Batteries, Accessories, Product Details)
- [ ] Shopping cart page UI
- [ ] Checkout page UI
- [ ] Customer dashboard UI
- [ ] Admin dashboard UI
- [ ] Product review display on product pages
- [ ] Wishlist frontend
- [ ] Blog frontend
- [ ] PDF invoice generation (pdfkit setup but not implemented)
- [ ] Image upload to Cloudinary
- [ ] Payment gateway integration (Sri Lankan banks)
- [ ] Email notifications
- [ ] WhatsApp support integration
- [ ] Rate limiting middleware
- [ ] Advanced search with Algolia or similar

## 📄 License

This project is proprietary and confidential.

## 🤝 Support

For support, email support@tyreshop.lk or contact via WhatsApp.

---

**Built with ❤️ in Beruwala, Sri Lanka**
