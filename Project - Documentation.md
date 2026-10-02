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


