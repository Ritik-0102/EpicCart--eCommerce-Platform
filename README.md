# EpicCart - eCommerce Platform

EpicCart is a full-stack, modern eCommerce platform built to provide a seamless shopping experience. It features user authentication, a persistent cart and wishlist, checkout flows with mock payment integration, order management, and a robust admin dashboard.

## Tech Stack
- **Frontend**: React (Vite), React Router, React Hot Toast
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker, Ready for Vercel (Frontend) and Render (Backend)

## Features
- Secure User Authentication (JWT & bcrypt) & Role-based Access (Admin vs. User)
- Dynamic Product Discovery (Search, Filters, Sort, Pagination)
- Shopping Cart & Wishlist functionality
- Checkout & Order Tracking with basic Email Notifications
- Responsive, Installable PWA (Progressive Web App) architecture
- Admin Dashboard for inventory and order management

## Local Development (Docker)
The easiest way to run the entire stack locally is using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed

### Steps
1. Clone the repository.
2. Ensure Docker is running.
3. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:80` and the backend API at `http://localhost:5000`.

## Local Development (Manual)
1. **Database**: Setup a PostgreSQL database and add the connection string to `backend/.env`.
2. **Backend**:
   - `cd backend`
   - `npm install`
   - Create `.env` (see `backend/.env.example`)
   - `npx prisma migrate dev`
   - `npm start`
3. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Deployment Configuration
- **Frontend**: Designed for Vercel. Ensure the `VITE_API_URL` environment variable points to your deployed backend URL.
- **Backend**: Designed for Render/Heroku. Ensure you provide all required environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.).
- **Database**: Use Neon.tech or Supabase for a free, managed PostgreSQL database.

See `Project - Documentation.md` for a comprehensive overview of the architecture and deployment strategies.
