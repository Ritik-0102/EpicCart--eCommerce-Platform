// Frontend application entrypoint: initializes React and mounts to the DOM
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

// Register Progressive Web App (PWA) service worker for offline caching and installability
const updateSW = registerSW({
  onNeedRefresh() {
    // Callback when a newer version of the web app is available
  },
  onOfflineReady() {
    // Callback when assets are cached and app is ready to work offline
  },
})

// Create the React 18 root and attach to the #root element in index.html
// Context Providers are nested so that downstream components have access to auth, cart, and wishlist state
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
