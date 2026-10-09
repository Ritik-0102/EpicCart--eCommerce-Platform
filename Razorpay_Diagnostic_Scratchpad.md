# EpicCart Razorpay Payment Diagnostic Scratchpad

## Phase 1: Trace Payment Flow
- [ ] Inspect frontend/src/pages/OrderDetails.jsx
- [ ] Inspect frontend/src/services/api.js
- [ ] Inspect backend/controllers/paymentController.js
- [ ] Inspect backend/routes/paymentRoutes.js
- [ ] Inspect backend/server.js / backend/app.js
- [ ] Inspect backend/package.json
- [ ] Inspect backend/prisma/schema.prisma

## Phase 2: Diagnose environment configuration
- [ ] Check required env vars in backend (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
- [ ] Check required env vars in frontend (VITE_RAZORPAY_KEY_ID, VITE_API_URL)

## Phase 3: Fix backend order creation
- [ ] Verify Razorpay SDK installation
- [ ] Check amount conversion (INR -> paise)
- [ ] Check route registration
- [ ] Check auth headers
- [ ] Check order ownership validation

## Phase 4: Improve diagnostics
- [ ] Enhance error logging in paymentController.js
- [ ] Improve frontend error display in OrderDetails.jsx

## Phase 5: Fix and verify Checkout
- [ ] Verify script load
- [ ] Verify amount and currency
- [ ] Verify signature logic

## Phase 6: Scratchpad verification
- [ ] Run backend tests / manual curl tests
- [ ] Run frontend build

## Findings / Root Cause
- **Currency Mismatch (Root Cause):** The backend `paymentController.js` was hardcoded to create Razorpay orders in `USD` (`currency: "USD"`). For Indian merchant accounts, `USD` transactions might fail unless international payments are enabled, throwing an error during `initiatePayment`.
- **Obscured Errors:** The backend caught the Razorpay SDK error but only logged `error` and sent `error.message`. Razorpay errors often contain the real details in `error.description`. 
- **Frontend Masking:** The frontend `api.js` was ignoring the `data.error` field from the backend and simply throwing `data.message` ("Failed to initiate payment"). This caused the generic alert the user was seeing.

## Fixes Applied
1. Changed `currency: "USD"` to `currency: "INR"` in `backend/controllers/paymentController.js`.
2. Improved server-side error logging to include `error.description` and returned it in the JSON response.
3. Updated `frontend/src/services/api.js` to throw `data.error || data.message`, ensuring that any API failures surface the specific SDK/backend reason to `OrderDetails.jsx`.
