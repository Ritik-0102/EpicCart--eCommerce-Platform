# Admin Portal Implementation Plan

## Phase 1: Audit & Bootstrap
- [ ] Inspect existing schemas and setup.
- [ ] Create `Admin Bootstrap` backend route (`POST /api/admin/setup`) secured by `ADMIN_BOOTSTRAP_SECRET`.
- [ ] Add `ADMIN_BOOTSTRAP_SECRET` to `backend/.env.example`.
- [ ] Create `frontend/src/pages/admin/AdminSetup.jsx` (one-time setup UI).

## Phase 2: Admin Navigation & Shell
- [ ] Create `AdminLayout.jsx` with responsive sidebar, top nav, breadcrumbs, profile/logout.
- [ ] Create `AdminDashboard.jsx` mapping to `/admin/dashboard`.
- [ ] Add route guards to frontend `App.jsx` (`/admin/*`).

## Phase 3: Dashboard Analytics
- [ ] Add `GET /api/admin/dashboard` backend route to aggregate orders, revenue, users, low-stock, etc.
- [ ] Connect `AdminDashboard.jsx` to fetch and render these stats.

## Phase 4: Product Management Enhancements (DONE)
- [x] Refine `AdminProducts.jsx` to support search, sorting, filtering, and pagination if required, leveraging existing `api.js` endpoints (or augmenting them).
- [x] Update `Prisma` schema safely for `slug`, `sku`, `lowStockThreshold`
- [x] Added SKU, slug, low stock, publish/featured/archive toggles to product creation and update logic.

## Phase 5: Inventory Management (DONE)
- [x] Add `InventoryLog` model to `schema.prisma`.
- [x] Create `GET /api/admin/inventory` and `POST /api/admin/inventory/adjust`.
- [x] Create `AdminInventory.jsx`.

## Phase 6: Order & Customer Management (DONE)
- [x] Create `AdminOrders.jsx` and `AdminCustomers.jsx` fetching data from backend.

## Phase 7: Categories, Coupons & Reviews (DONE)
- [x] Create `AdminCategories.jsx`, `AdminCoupons.jsx`, `AdminReviews.jsx`.
- [x] Augment existing API routes for CRUD operations on these entities.

## Phase 8: Content CMS & Settings (DONE)
- [x] Add `StoreSettings` model or `Content` model.
- [x] Create `AdminContent.jsx` and `AdminSettings.jsx`.

## Phase 9: Audit Logging (DONE)
- [x] Add `AuditLog` model.
- [x] Implement middleware/helpers to track mutations.
