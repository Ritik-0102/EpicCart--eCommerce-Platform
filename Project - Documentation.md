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


