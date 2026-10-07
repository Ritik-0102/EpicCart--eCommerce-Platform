# EpicCart - Documentation

## Project Overview
EpicCart is a modern, responsive, full-stack e-commerce platform built with a focus on clean architecture and beginner-friendly, maintainable code. 

**Tech Stack:**
- **Frontend:** React.js (via Vite)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Deployment:** Free-tier platforms (No AWS)
- **Additional:** Progressive Web App (PWA) support planned

## Development Guidelines
- Frontend and backend reside in separate directories.
- Emphasis on understanding over copy-pasting.
- Git operations are handled manually by the developer.
- Step-by-step implementation following strict daily tasks.

---

## Daily Progress Log

### Day 11: Payment Integration (Razorpay)
- **Completed Work:**
  - Integrated the `razorpay` Node.js SDK and added test API keys into backend environment variables (`.env`).
  - Implemented the `/api/payments/initiate` endpoint to generate a verified Razorpay Order ID corresponding to an EpicCart `PENDING` order.
  - Implemented the `/api/payments/verify` endpoint to cryptographically verify incoming payment signatures using `crypto.createHmac` and SHA256.
  - Guarded the Order status: The system only updates an order's status to `PAID` if the webhook/signature verification mathematically proves the payment was successfully processed by Razorpay.
  - Integrated the official Razorpay Checkout script dynamically on the frontend (`OrderDetails.jsx`).
  - Added explicit user feedback states (Payment Processing, Payment Success, Payment Failed) on the frontend.
  - Refined the Prisma schema to persist tracking variables: `razorpayOrderId`, `razorpayPaymentId`, and `razorpaySignature`.
- **Files Created:**
  - `backend/controllers/paymentController.js`
  - `backend/routes/paymentRoutes.js`
- **Files Modified:**
  - `backend/prisma/schema.prisma` (Added Razorpay tracking fields to `Order`)
  - `backend/app.js` (Mounted `/api/payments`)
  - `frontend/src/services/api.js` (Added payment initiation and verification calls)
  - `frontend/src/pages/OrderDetails.jsx` & `OrderDetails.css` (Added Checkout UI and status messages)
  - `Project - Documentation.md` (Updated logs)
- **Security Checkpoint (Payment Integrity):** Never trust frontend assertions like "Payment successful!". An attacker can easily spoof a network response. The backend recalculates the HMAC hex digest combining `razorpay_order_id` and `razorpay_payment_id` using the secret key, guaranteeing that Razorpay itself authorized the transaction.

### Day 10: Checkout and Order Management
- **Completed Work:**
  - Expanded the database schema with `Order`, `OrderItem`, and `Coupon` models to record immutable snapshots of purchases.
  - Implemented the Order status cycle (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
  - Built out the backend checkout system securely recalculating cart totals against real database product prices, completely ignoring any price claims from the frontend to prevent tampering.
  - Added backend support for Coupon application, securely applying discounts to server-side totals.
  - Utilized Prisma `$transaction` API to ensure that Order Creation, Inventory (stock) decrementing, and Cart clearing only execute atomically (if one step fails, everything rolls back).
  - Designed the `Checkout` UI, allowing users to enter a shipping address, review dynamic summary, and apply a coupon before confirming the order.
  - Developed the `Orders` (Order History) and `OrderDetails` pages to let users track their past purchases securely.
- **Files Created:**
  - `backend/controllers/orderController.js`
  - `backend/routes/orderRoutes.js`
  - `frontend/src/pages/Checkout.jsx` & `Checkout.css`
  - `frontend/src/pages/Orders.jsx` & `Orders.css`
  - `frontend/src/pages/OrderDetails.jsx` & `OrderDetails.css`
- **Files Modified:**
  - `backend/prisma/schema.prisma` (Added Order, OrderItem, and Coupon models)
  - `backend/app.js` (Mounted new protected order routes)
  - `frontend/src/services/api.js` (Added order checkout and history endpoints)
  - `frontend/src/App.jsx` (Registered Checkout and Order UI routes)
  - `frontend/src/pages/Cart.jsx` (Connected Proceed to Checkout button)
  - `frontend/src/pages/Account.jsx` (Added button for Order History)
- **Security Checkpoint (Transaction Safety):** Totals calculation is strictly isolated on the backend. When an order is placed, `productName` and `price` are snapshotted in the `OrderItem` row so historical receipts are not altered if a product price changes months later.

### Day 9: Cart and Wishlist
- **Completed Work:**
  - Expanded the database schema with `Cart`, `CartItem`, `Wishlist`, and `WishlistItem` models, establishing relationships with `User` and `Product`.
  - Created backend controllers (`cartController.js`, `wishlistController.js`) and routes (`cartRoutes.js`, `wishlistRoutes.js`) with JWT protection.
  - Handled critical e-commerce logic on the backend: Cart calculations (subtotals and totals) are performed dynamically on the server based on current product prices in the database, ensuring users cannot manipulate costs.
  - Implemented the frontend `CartContext` and `WishlistContext` to manage global state and interact with the protected API endpoints.
  - Developed the `Cart` and `Wishlist` UI pages, rendering lists of products, quantities, dynamic subtotals, and empty/loading states gracefully.
  - Re-wrote `Navbar` and `ProductDetails` components to utilize the new context data and show dynamic badge counts and conditional "Add to Cart" / "Wishlist" buttons.
- **Files Created:**
  - `backend/controllers/cartController.js`, `backend/controllers/wishlistController.js`
  - `backend/routes/cartRoutes.js`, `backend/routes/wishlistRoutes.js`
  - `frontend/src/context/CartContext.jsx`, `frontend/src/context/WishlistContext.jsx`
  - `frontend/src/pages/Cart.jsx`, `Cart.css`, `frontend/src/pages/Wishlist.jsx`, `Wishlist.css`
- **Files Modified:**
  - `backend/prisma/schema.prisma` (Added Cart and Wishlist models)
  - `backend/app.js` (Mounted new protected routes)
  - `frontend/src/services/api.js` (Added cart/wishlist network requests)
  - `frontend/src/App.jsx` (Registered global context providers)
  - `frontend/src/components/layout/Navbar.jsx`
  - `frontend/src/pages/ProductDetails.jsx`
- **Known Issues:** Pending a running PostgreSQL instance, interacting with the cart/wishlist gracefully errors out indicating the backend cannot process the operations.

### Day 8: Authentication & Security
- **Completed Work:**
  - Expanded the database schema (`schema.prisma`) with a secure `User` model.
  - Implemented the `authController.js` and `authRoutes.js` for `POST /api/auth/register`, `POST /api/auth/login`, and the protected `GET /api/auth/profile`.
  - Secured passwords by automatically hashing them with **bcrypt** (`bcryptjs`) before saving to the database.
  - Implemented stateless authentication using **JSON Web Tokens (JWT)** (`jsonwebtoken`).
  - Created the `protect` middleware to mathematically verify incoming JWTs via the HTTP `Authorization: Bearer <token>` header, effectively blocking unauthorized access to protected routes.
  - Built out the Frontend interface with `Login`, `Register`, and `Account` React pages.
  - Implemented a global React Context (`AuthContext.jsx`) backed by `localStorage` to persist the user's logged-in state across page reloads.
  - Wired up dynamic Navigation logic (changing "Login" to the User's first name upon successful login).
- **Files Created:**
  - `backend/middleware/authMiddleware.js`
  - `backend/controllers/authController.js`
  - `backend/routes/authRoutes.js`
  - `frontend/src/context/AuthContext.jsx`
  - `frontend/src/pages/Login.jsx`, `Register.jsx`, `Account.jsx`, and `Auth.css`
- **Files Modified:**
  - `backend/prisma/schema.prisma` (Added User model)
  - `backend/app.js` (Mounted auth routes)
  - `frontend/src/services/api.js` (Added auth fetch wrappers)
  - `frontend/src/App.jsx` (Wrapped app in `<AuthProvider>`)
  - `frontend/src/components/layout/Navbar.jsx` (Added dynamic auth state UI)
  - `Project - Documentation.md`
- **Security Considerations Implemented:**
  - **No Plaintext Passwords:** Passwords are mathematically transformed using bcrypt salts and hashes. Even if the database is compromised, the actual passwords remain secure.
  - **No Secrets on Frontend:** The `JWT_SECRET` lives strictly in the backend `.env` file. The frontend only receives the mathematical output (the token).
  - **Stateless Tokens:** The server doesn't have to look up the token in a database table every request; it simply verifies the cryptographic signature, making the system highly scalable.

### Day 7: Product Discovery & Routing
- **Completed Work:**
  - Upgraded the Backend `GET /api/products` endpoint to support advanced query parameters: `?search=...&category=...&sort=...&page=...&limit=...`.
  - Configured Prisma in the controller to dynamically build SQL `WHERE`, `ORDER BY`, `SKIP`, and `TAKE` clauses based on incoming query strings.
  - Installed `react-router-dom` in the frontend to transform EpicCart into a Single Page Application (SPA).
  - Created the **Product Discovery** page (`Shop.jsx`) featuring keyword search, category filtering, price sorting, and pagination logic.
  - Created the **Product Details** page (`ProductDetails.jsx`) to fetch and display deep information (images, price, stock, description) based on the URL parameter (`/products/:id`).
  - Implemented dynamic 404 "Not Found" error states for invalid Product IDs.
  - Replaced standard `<a>` tags with React Router `<Link>` components to prevent full-page refreshes.
- **Files Created:**
  - `frontend/src/pages/Home.jsx`
  - `frontend/src/pages/Shop.jsx` & `Shop.css`
  - `frontend/src/pages/ProductDetails.jsx` & `ProductDetails.css`
- **Files Modified:**
  - `backend/controllers/productController.js`
  - `frontend/src/services/api.js`
  - `frontend/src/App.jsx`
  - `frontend/src/components/layout/Navbar.jsx`
  - `frontend/src/components/home/FeaturedProducts.jsx`
  - `Project - Documentation.md`
- **Known Issues:** UI renders error states elegantly as PostgreSQL remains unconfigured locally, blocking data hydration.

### Day 6: Frontend and Backend Integration
- **Completed Work:**
  - Configured Cross-Origin Resource Sharing (`cors`) in the backend to allow requests from the React frontend.
  - Setup environment variables on the frontend (`.env`, `VITE_API_URL`) to securely store the backend URL.
  - Created a reusable API service layer (`frontend/src/services/api.js`) using the `fetch` API for modularity.
  - Refactored `Categories.jsx` and `FeaturedProducts.jsx` to swap static mock data with real React `useState` and `useEffect` API fetching.
  - Implemented resilient UI components capable of rendering Loading states, Error states, Empty states, and the final Data state.
- **Files Created:**
  - `frontend/.env` & `frontend/.env.example`
  - `frontend/src/services/api.js`
- **Files Modified:**
  - `backend/app.js` (Added CORS middleware)
  - `frontend/src/components/home/Categories.jsx` & `Categories.css`
  - `frontend/src/components/home/FeaturedProducts.jsx`
  - `Project - Documentation.md`
- **Known Issues:** The frontend is successfully wired up to the backend. However, because the local PostgreSQL database is still offline, the UI accurately catches the backend's `500` error and displays the user-friendly "Failed to load products/categories" error state as designed.

### Day 5: Product and Category APIs
- **Completed Work:**
  - Implemented structured backend routes and controllers for Categories and Products.
  - Added the following Category endpoints:
    - `GET /api/categories` - Fetch all categories.
    - `GET /api/categories/:id` - Fetch a category by ID (includes its products).
  - Added the following Product endpoints:
    - `GET /api/products` - Fetch all products (includes category details).
    - `GET /api/products/:id` - Fetch product by ID.
    - `POST /api/products` - Create a new product. (Includes body validation).
    - `PUT /api/products/:id` - Update an existing product.
    - `DELETE /api/products/:id` - Delete a product.
  - Linked all controllers to Prisma for actual database operations.
  - Enforced graceful error handling via the `try/catch` and `next(error)` pattern.
- **Files Created:**
  - `backend/controllers/categoryController.js`
  - `backend/controllers/productController.js`
  - `backend/routes/categoryRoutes.js`
  - `backend/routes/productRoutes.js`
- **Files Modified:**
  - `backend/app.js` (Mounted the newly created routers)
  - `Project - Documentation.md`
- **Known Issues:** As in Day 4, until PostgreSQL is running locally, the endpoints will return a `500 Internal Server Error` due to Prisma connection failure. However, basic validation (`400 Bad Request`) operates successfully.

### Day 4: Database Setup & Prisma ORM
- **Completed Work:**
  - Installed Prisma and `@prisma/client`.
  - Configured `schema.prisma` to use the PostgreSQL provider.
  - Defined the `Category` and `Product` models with a 1-to-Many relational link.
  - Drafted the migration schema including attributes like `@id`, `@default(autoincrement())`, and `@relation`.
  - Created a database seed script (`prisma/seed.js`) with sample categories and products using `prisma.category.upsert` and `prisma.product.create`.
  - Configured the Prisma seed command in `package.json`.
  - Added the `DATABASE_URL` environment variable to `.env` and `.env.example`.
- **Files Created:**
  - `backend/prisma/schema.prisma` (Database schema definitions)
  - `backend/prisma/seed.js` (Seed script for mock data)
- **Files Modified:**
  - `backend/package.json` (Added Prisma dependencies and seed configuration)
  - `backend/.env` & `backend/.env.example` (Added PostgreSQL connection string)
  - `Project - Documentation.md`
- **Known Issues:** The local environment does not currently have a running PostgreSQL instance on `localhost:5432`. The `npx prisma migrate dev` command fails with `P1001: Can't reach database server`. The database must be installed and running locally to complete the migration and seeding.

### Day 3: Backend Fundamentals
- **Completed Work:**
  - Refactored the backend to separate the Express configuration (`app.js`) from the server entry point (`server.js`).
  - Implemented environment variable management using the `dotenv` package. Created `.env` and `.env.example` templates.
  - Added essential middleware including `express.json()` to automatically parse incoming JSON payloads.
  - Constructed a `/api/health` endpoint for monitoring backend stability.
  - Configured a catch-all 404 middleware for invalid routes.
  - Integrated centralized error handling middleware to cleanly process and format application errors.
  - Set up `nodemon` for auto-restarting the server during active development.
- **Files Created:**
  - `backend/app.js` (Express configuration)
  - `backend/.env` (Local secrets)
  - `backend/.env.example` (Template for required secrets)
- **Files Modified:**
  - `backend/server.js` (Simplified to import from app.js)
  - `backend/package.json` (Added `dev` script for nodemon)
  - `Project - Documentation.md`
- **Known Issues:** The backend currently does not interact with a database. It simply processes basic requests.

### Day 2: UI Foundation and Homepage
- **Completed Work:**
  - Established a design system via CSS variables (`index.css`) outlining typography, spacing, and a modern primary/accent color palette.
  - Created a responsive `Navbar` component with logo, search bar, icons, and a mobile hamburger menu toggle.
  - Implemented a visually engaging `Hero` section featuring a promotional call-to-action.
  - Designed a `Promotions` section with dual offer banners.
  - Added a `Categories` section displaying mock category data with icons.
  - Developed a `FeaturedProducts` section using CSS Grid and mock data, rendering premium product cards with pricing and ratings.
  - Implemented a `Benefits` section highlighting trust factors like Secure Payment and Free Shipping.
  - Constructed a professional `Footer` with categorized links and a newsletter subscription layout.
  - Assembled all components logically in `App.jsx` to form the completed homepage.
- **Files Created:**
  - `src/components/layout/` (`Navbar.jsx`, `Navbar.css`, `Footer.jsx`, `Footer.css`)
  - `src/components/home/` (`Hero.jsx`, `Hero.css`, `Promotions.jsx`, `Promotions.css`, `Categories.jsx`, `Categories.css`, `FeaturedProducts.jsx`, `FeaturedProducts.css`, `Benefits.jsx`, `Benefits.css`)
  - `src/data/mockData.js`
- **Files Modified:**
  - `src/index.css` (Base design system)
  - `src/App.jsx` (Homepage structure)
  - `Project - Documentation.md`
- **Known Issues:** The data is entirely static for now. Cart and User icons do not navigate anywhere functionally. Responsive mobile menu expands but doesn't handle navigation routes. Ready for state/routing next.

### Day 1: Project Initialization
- **Completed Work:** Initialized separate frontend (Vite React) and backend (Node/Express). Added simple Express server and React entry point.
- **Files Created:** `frontend/`, `backend/`, `backend/server.js`, `README.md`, `.gitignore`
- **Files Modified:** `frontend/src/App.jsx`, `Project - Documentation.md`
- **Known Issues:** None. Ready for Day 2.



## Day 12: Admin Dashboard

### Roles and Permissions
We have introduced a role-based access control (RBAC) system. The `User` model now includes a `Role` field, which can be either `USER` or `ADMIN`.
- **Authentication**: The process of verifying a user's identity (e.g., logging in with email and password). It answers the question, "Who are you?".
- **Authorization**: The process of verifying what a specific user has access to. It answers the question, "Are you allowed to do this?". For example, an authenticated user might not be authorized to view the admin dashboard unless their role is `ADMIN`.

We use a custom `admin` middleware in `authMiddleware.js` to ensure that only users with the `ADMIN` role can access sensitive endpoints.

### Admin Endpoints
- **GET `/api/admin/summary`**: Fetches a high-level summary (total products, orders, users).
- **GET `/api/admin/orders`**: Fetches all orders from all users across the platform.
- **PUT `/api/admin/orders/:id/status`**: Updates the fulfillment status of an order (e.g., PENDING -> SHIPPED).
- **PUT `/api/admin/products/:id/stock`**: Updates the inventory stock level of a specific product.
- **POST/PUT/DELETE `/api/products` & `/api/categories`**: These generic creation/modification endpoints are now protected by the `admin` authorization middleware.

### Frontend Integration
- Added an `AdminDashboard` with summary metrics.
- Added `AdminProducts` for updating inventory inline.
- Added `AdminOrders` for viewing all orders and updating their fulfillment status.
- Added dynamic navigation link in the `Navbar` to display the "Admin" section only for authorized users.

## Day 13: Reviews, Notifications, and UI Polish

### Features and Implementation
1. **Product Reviews & Ratings**: 
   - Introduced a `Review` model in Prisma.
   - Built backend endpoints `POST /api/products/:id/reviews` (protected route) and `GET /api/products/:id/reviews` to manage product reviews.
   - The system calculates the `averageRating` on the fly.
   - Implemented an interactive UI on the `ProductDetails` page that renders loading skeletons, existing reviews, and a form to submit new reviews if the user is authenticated.

2. **Email Notifications**:
   - Integrated `nodemailer` to dispatch order confirmation emails asynchronously upon successful checkout.
   - Designed to run non-blockingly and wrapped in a try/catch block so as not to interrupt the order flow in case of email delivery failure.
   - Requires `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` in the `.env` file (currently using mailtrap configuration).

3. **UI Polish & Toast Notifications**:
   - Replaced native browser `alert()` usage with `react-hot-toast` for consistent, modern, and non-blocking notification alerts (`toast.success` and `toast.error`).
   - Integrated loading skeletons into the UI, specifically the `ProductDetails` page, to prevent layout shift and offer a better user experience.
   - Ensured empty states are handled gracefully across `Cart`, `Checkout`, and `Orders` pages.

## Day 14: PWA and Responsive Optimization

### PWA Architecture and Limitations
- **Progressive Web App (PWA):** Web applications built to act like native apps on mobile and desktop. They can be installed directly from the browser to the home screen or app launcher without going through an app store.
- **Web App Manifest:** A JSON file (`manifest.webmanifest`) that informs the browser about the app's metadata, such as its name, icons (e.g., maskable icons for Android), display mode (standalone), and theme colors. This triggers the "Add to Home Screen" prompt on supported browsers.
- **Service Worker:** A background JavaScript script acting as a network proxy. It intercepts requests and serves cached resources. We implemented it using `vite-plugin-pwa` combined with Workbox. 
- **Caching Strategy:**
  - **Static Assets:** Cached using a `CacheFirst` strategy (e.g., Unsplash images) to improve load times and enable offline UI rendering.
  - **API Requests:** We employed a `NetworkFirst` strategy for `/api/products` and `/api/categories`.
  - **Security Considerations:** We **did not** aggressively cache sensitive, authenticated endpoints (like `/api/cart` or `/api/orders`) to prevent stale or secure data from persisting improperly in the service worker cache.
- **Limitations:** While PWAs are excellent for fast loads and cross-platform installation, iOS Safari's support for PWAs and Push Notifications remains slightly more restrictive than Android/Chrome. Furthermore, advanced offline functionality (like offline cart syncing) requires complex IndexedDB state management, which is deferred to prevent unnecessary complexity.

### Responsive Optimization
- **Touch Targets:** Updated padding and `min-height: 44px` across navigation icons, buttons, and inputs to align with iOS and Android accessibility guidelines for comfortable touch interaction.
- **Overflow Prevention:** Ensured `overflow-x: hidden` prevents horizontal scrolling breaks on mobile viewports.
- **Navigation:** Updated the mobile menu to effectively integrate React Router (`Link`) to ensure true SPA routing without full page reloads, a prerequisite for feeling like a native application.

## Day 15: Production Preparation and Deployment

### Containerization (Docker)
Containerization allows us to package our application and its environment so it runs identically everywhere.
- **Docker Images:** Think of an image as a read-only blueprint or recipe. It contains the OS, libraries, and code needed to run the app. We created a `Dockerfile` for the backend and frontend. The backend specifically uses a Debian-based slim image (`node:20-bookworm-slim`) with native glibc and OpenSSL installed. This is critical for compatibility with Prisma's query engine, avoiding issues commonly encountered with Alpine Linux (musl libc).
- **Docker Containers:** A container is a running instance of an image. If the image is a recipe, the container is the baked cake.
- **Ports:** Ports are communication endpoints. Inside the Docker network, our backend runs on port `5000`. We map this to our host machine's port `5000` so we can access it via `localhost:5000`.
- **Environment Variables:** These are dynamic values (like API keys or Database URLs) passed to the container at runtime. This keeps secrets out of our source code.

### CI/CD Workflow (Jenkins)
CI/CD stands for Continuous Integration and Continuous Deployment.
- **Continuous Integration (CI):** When a developer commits code, the CI server (like Jenkins) automatically downloads it, installs dependencies, and runs tests to ensure nothing is broken.
- **Continuous Deployment (CD):** If the CI checks pass, the CD process automatically builds the Docker images or pushes the code to a live production server.
- We created a basic `Jenkinsfile` that outlines stages: Checkout, Install dependencies, Build the React app, and Build the Docker images.

### Free-Tier Deployment Strategy
While we can run Docker locally, we can also deploy using modern PaaS (Platform as a Service) providers:
1. **Database (Neon.tech):**
   - Create a free PostgreSQL instance on Neon.
   - Obtain the connection string.
2. **Backend (Render.com):**
   - Connect your GitHub repository to Render and create a new "Web Service".
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add `DATABASE_URL` (from Neon), `JWT_SECRET`, and email credentials. Set `CORS_ORIGIN` to your Vercel frontend URL.
3. **Frontend (Vercel):**
   - Import the repository into Vercel.
   - Set the Root Directory to `frontend`.
   - Vercel automatically detects Vite and configures the build command (`npm run build`).
   - **Environment Variables:** Add `VITE_API_URL` pointing to your live Render backend URL.

### Security Configurations
- **Secrets Management:** Never commit `.env` files. Always use the deployment platform's environment variables settings panel to inject production secrets.
- **CORS:** The backend must be configured to only accept requests from the exact Vercel URL in production.

### Final Review & Known Limitations
EpicCart represents a robust foundation for an eCommerce platform.
- **Authentication:** JWT-based stateless authentication works reliably.
- **Responsive PWA:** The frontend is optimized for touch and installable via modern browsers.
- **Limitations:**
  - Payment is simulated via Razorpay test mode; real payment gateway keys and strict webhook verifications are required for production.
  - Image hosting is local/placeholder. For production scale, integrating Cloudinary or AWS S3 via multer is necessary.
  - No automated email recovery (password reset) is implemented yet.

### Final Project Summary & Future Improvements
EpicCart has evolved from a static HTML prototype into a fully functional, containerized, and deployment-ready modern eCommerce platform. Key milestones achieved:
1. **Frontend Architecture:** React Router SPA, Context API state management (Auth, Cart, Wishlist), component-driven UI, and comprehensive CSS variable themes.
2. **Backend Services:** Express.js REST API with Postgres/Prisma bridging, secure JWT authentication, encrypted passwords (bcrypt).
3. **Core eCommerce Flow:** Searching/Filtering products, dynamic cart interactions, complex checkout schema handling, and mocked Razorpay integration.
4. **Resilience & UX:** Responsive CSS, comprehensive loading states (skeletons), non-blocking notifications (`react-hot-toast`), and PWA offline capability.
5. **DevOps & Infrastructure:** Dockerized environments for both services, Nginx reverse proxy configuration for the SPA, Jenkins pipeline automation for CI workflows, and deployment guidelines for free-tier PaaS (Vercel, Render, Neon).

#### Recommended Future Improvements
- **Automated Testing:** Implement Jest/Supertest for backend unit and integration testing. Implement Cypress/Playwright for frontend end-to-end user flows.
- **Enhanced Payment Security:** Integrate a live payment gateway (Stripe/Razorpay) with cryptographically verified webhooks to prevent spoofed successful checkouts.
- **Microservices & Messaging:** Transition the email notification system to a background queue (e.g., RabbitMQ, Redis BullMQ) to ensure message delivery without risking transaction timeouts.
- **Advanced State Management:** Migrate from React Context API to Redux Toolkit or Zustand if the application complexity increases.
- **Cloud Object Storage:** Hook up Cloudinary or AWS S3 for uploading product images dynamically from the Admin Dashboard.

### Deployment Status
- **Neon PostgreSQL**: DEPLOYED / WORKING
- **Render Backend**: DEPLOYED / LIVE
- **Backend API Testing**: PASSED
- **Vercel Frontend**: NOT YET DEPLOYED

