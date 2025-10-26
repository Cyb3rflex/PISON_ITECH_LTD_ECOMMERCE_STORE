/*
PinStore Frontend Demo (single-file React app)
Stack: React + Tailwind CSS + Framer Motion
Purpose: Demo frontend to show client — includes: auth mock UI, profile, wishlist, product catalog with filters/search, cart & checkout mock, order history, support.

How to use:
1. Create a Vite React app (or add this file to your existing React app):
   npm create vite@latest pinstore-demo -- --template react
   cd pinstore-demo
2. Install deps:
   npm install
   npm install framer-motion
   # Tailwind setup (if not already)
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   # Add Tailwind directives to src/index.css: @tailwind base; @tailwind components; @tailwind utilities;
3. Replace src/App.jsx with this file, ensure src/main.jsx imports './index.css'
4. Run:
   npm run dev

This file is intentionally self-contained for the demo (no backend). Data persisted to localStorage.
*/

import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Mock Data ---
const PRODUCTS = [
  { id: 'p1', title: 'Learn React (e-book)', category: 'E-books & Printed Books', format: 'ebook', price: 9.99, brand: 'CodePress', rating: 4.6, stock: 999 },
  { id: 'p2', title: 'Learn React (Printed)', category: 'E-books & Printed Books', format: 'print', price: 19.99, brand: 'CodePress', rating: 4.6, stock: 12 },
  { id: 'p3', title: 'Wireless Headphones', category: 'Electronics', format: 'physical', price: 49.99, brand: 'Soundly', rating: 4.2, stock: 25 },
  { id: 'p4', title: 'Kitchen Knife Set', category: 'Household Utensils', format: 'physical', price: 29.99, brand: 'SharpHome', rating: 4.8, stock: 7 },
  { id: 'p5', title: 'Portable Drill', category: 'Equipment', format: 'physical', price: 89.99, brand: 'BuildIt', rating: 4.1, stock: 5 },
  { id: 'p6', title: 'Mystery Box', category: 'General Merchandise', format: 'physical', price: 14.99, brand: 'Bazar', rating: 3.9, stock: 0 }
]

const CATEGORIES = [
  'E-books & Printed Books',
  'Electronics',
  'Household Utensils',
  'Equipment',
  'General Merchandise'
]

// --- Helpers ---
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))
const load = (k, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback } catch { return fallback }
}

// --- App ---
export default function App () {
  const [user, setUser] = useState(load('user', null))
  const [cart, setCart] = useState(load('cart', {}))
  const [wishlist, setWishlist] = useState(load('wishlist', []))
  const [orders, setOrders] = useState(load('orders', []))
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 200])
  const [formatFilter, setFormatFilter] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(load('coupon', null))
  const [page, setPage] = useState('catalog') // 'catalog' | 'product' | 'profile' | 'wishlist' | 'orders' | 'support'
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => save('cart', cart), [cart])
  useEffect(() => save('wishlist', wishlist), [wishlist])
  useEffect(() => save('orders', orders), [orders])
  useEffect(() => save('user', user), [user])
  useEffect(() => save('coupon', appliedCoupon), [appliedCoupon])

  // --- derived products after filters/search ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false
      if (formatFilter && p.format !== formatFilter) return false
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      if (q) {
        if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [query, selectedCategory, priceRange, formatFilter])

  // --- cart ops ---
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const next = { ...prev }
      next[product.id] = (next[product.id] || 0) + qty
      return next
    })
  }
  const updateCartItem = (id, qty) => {
    setCart(prev => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }
  const clearCart = () => setCart({})

  // --- wishlist ops ---
  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // --- checkout ---
  const subtotal = Object.entries(cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(pp => pp.id === id)
    return s + (p ? p.price * qty : 0)
  }, 0)
  const discount = appliedCoupon === 'SAVE10' ? subtotal * 0.1 : 0
  const shipping = subtotal > 50 ? 0 : 4.99
  const total = Math.max(0, subtotal - discount + shipping)

  const placeOrder = (shippingMethod = 'Standard') => {
    if (!user) return alert('Please sign in to place order')
    const order = {
      id: 'order_' + Date.now(),
      items: Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find(p => p.id === id), qty })),
      subtotal, discount, shippingMethod, shippingCost: shipping, total, status: 'Processing', createdAt: new Date().toISOString()
    }
    setOrders(prev => [order, ...prev])
    clearCart()
    setPage('orders')
  }

  // --- auth mock ---
  const mockSignIn = (payload) => {
    setUser({ id: 'u1', name: payload.name || 'Guest', email: payload.email || null, phone: payload.phone || null, addresses: [], paymentMethods: [] })
  }
  const signOut = () => setUser(null)

  // --- coupons ---
  const applyCoupon = () => {
    if (coupon === 'SAVE10') { setAppliedCoupon('SAVE10'); alert('Coupon applied: 10% off') }
    else alert('Invalid coupon (demo: try SAVE10)')
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header user={user} onSign={() => setPage('profile')} onOpenCart={() => setShowCart(true)} setPage={setPage} signOut={signOut} />

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-1">
          <Filters
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            formatFilter={formatFilter}
            setFormatFilter={setFormatFilter}
            setQuery={setQuery}
          />

          <SupportCard onContact={() => setPage('support')} />
        </section>

        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <input aria-label="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by keyword or brand" className="px-3 py-2 border rounded w-96" />
              <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={() => { setQuery('') }}>Clear</button>
            </div>
            <div className="flex gap-2 items-center">
              <button className="px-3 py-2 rounded border" onClick={() => { setAppliedCoupon(null); setCoupon(''); alert('Demo: coupon reset') }}>Reset coupon</button>
              <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={() => setShowCart(true)}>View Cart ({Object.keys(cart).length})</button>
            </div>
          </div>

          <ProductGrid products={filtered} onAdd={addToCart} onView={p => { setSelectedProduct(p); setPage('product') }} toggleWishlist={toggleWishlist} wishlist={wishlist} />

          <div className="mt-6">
            <CartFooter subtotal={subtotal} appliedCoupon={appliedCoupon} shipping={shipping} total={total} onCheckout={() => { setShowCart(true); setPage('checkout') }} />
          </div>
        </section>
      </main>

      <AnimatePresence>{showCart && <CartModal cart={cart} onClose={() => setShowCart(false)} updateCartItem={updateCartItem} products={PRODUCTS} subtotal={subtotal} applyCoupon={(c)=>{setCoupon(c); setAppliedCoupon(c==='SAVE10'? 'SAVE10': null)}} placeOrder={placeOrder} />}</AnimatePresence>

      <footer className="bg-white border-t py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">PinStore Demo — frontend only. Client preview build.</div>
      </footer>
    </div>
  )
}

// --- Header ---
function Header ({ user, onSign, onOpenCart, setPage, signOut }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold cursor-pointer" onClick={() => setPage('catalog')}>PinStore</div>
          <nav className="hidden md:flex gap-3 text-sm">
            <button onClick={() => setPage('catalog')} className="px-2 py-1">Catalog</button>
            <button onClick={() => setPage('wishlist')} className="px-2 py-1">Wishlist</button>
            <button onClick={() => setPage('orders')} className="px-2 py-1">Orders</button>
            <button onClick={() => setPage('support')} className="px-2 py-1">Support</button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm mr-2">Demo: {user ? `Signed in as ${user.name}` : 'Not signed in'}</div>
          {user ? (
            <>
              <button className="px-3 py-2 border rounded" onClick={() => setPage('profile')}>Profile</button>
              <button className="px-3 py-2 bg-red-500 text-white rounded" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <AuthButtons onSignIn={onSign} />
          )}

          <button onClick={onOpenCart} className="px-3 py-2 border rounded">Cart</button>
        </div>
      </div>
    </header>
  )
}

function AuthButtons ({ onSignIn }) {
  const demoSignIn = () => onSignIn({ name: 'Ali', email: 'ali@example.com' })
  return (
    <div className="flex gap-2">
      <button className="px-3 py-2 border rounded" onClick={demoSignIn}>Sign in (demo)</button>
      <div className="px-3 py-2 border rounded">Social</div>
    </div>
  )
}

// --- Filters ---
function Filters ({ categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, formatFilter, setFormatFilter, setQuery }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="font-semibold mb-3">Filters</h3>
      <div className="mb-3">
        <label className="block text-sm mb-1">Category</label>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full p-2 border rounded">
          <option value="">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Format</label>
        <select value={formatFilter} onChange={e => setFormatFilter(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Any</option>
          <option value="ebook">E-book</option>
          <option value="print">Print</option>
          <option value="physical">Physical</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Price range (demo slider)</label>
        <div className="flex gap-2">
          <input type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value||0), priceRange[1]])} className="w-1/2 p-2 border rounded" />
          <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value||9999)])} className="w-1/2 p-2 border rounded" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => { setSelectedCategory(''); setFormatFilter(''); setQuery('') }} className="px-3 py-2 border rounded">Reset</button>
      </div>
    </div>
  )
}

// --- Product grid ---
function ProductGrid ({ products, onAdd, onView, toggleWishlist, wishlist }) {
  if (!products.length) return <div className="p-6 bg-white rounded shadow">No products match filters.</div>
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p => (
        <motion.div key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded shadow">
          <ProductCard p={p} onAdd={() => onAdd(p, 1)} onView={() => onView(p)} wishlist={wishlist.includes(p.id)} toggleWishlist={() => toggleWishlist(p.id)} />
        </motion.div>
      ))}
    </div>
  )
}

function ProductCard ({ p, onAdd, onView, toggleWishlist, wishlist }) {
  return (
    <div>
      <div className="h-40 bg-gray-100 rounded flex items-center justify-center mb-3">Image</div>
      <div className="font-semibold">{p.title}</div>
      <div className="text-sm text-gray-600">{p.brand} • {p.category}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-lg font-bold">${p.price.toFixed(2)}</div>
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded" onClick={onView}>View</button>
          <button className="px-2 py-1 bg-indigo-600 text-white rounded" onClick={onAdd}>Add</button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
        <div>Rating: {p.rating}</div>
        <button onClick={toggleWishlist} className={`px-2 py-1 rounded ${wishlist ? 'bg-yellow-300' : 'border'}`}>{wishlist ? 'Saved' : 'Save'}</button>
      </div>
    </div>
  )
}

// --- Cart Modal ---
function CartModal ({ cart, onClose, updateCartItem, products, subtotal, applyCoupon, placeOrder }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-end lg:items-center justify-end p-4">
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="bg-white w-full lg:w-1/3 rounded-t-lg lg:rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>

        <div className="space-y-3 max-h-64 overflow-auto">
          {Object.keys(cart).length === 0 && <div className="text-sm text-gray-500">Cart is empty.</div>}
          {Object.entries(cart).map(([id, qty]) => {
            const p = products.find(pp => pp.id === id)
            if (!p) return null
            return (
              <div key={id} className="flex items-center gap-3 border-b pb-2">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">Img</div>
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-500">${p.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" value={qty} onChange={e => updateCartItem(id, Math.max(0, Number(e.target.value)))} className="w-16 p-1 border rounded text-center" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between mb-2"><div className="text-sm">Subtotal</div><div>${subtotal.toFixed(2)}</div></div>
          <div className="flex items-center gap-2 mb-3">
            <input placeholder="Coupon code" className="flex-1 p-2 border rounded" onChange={e=>applyCoupon(e.target.value)} />
            <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={()=>alert('Apply coupon in demo via Cart footer')}>Apply</button>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 border rounded" onClick={onClose}>Continue shopping</button>
            <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded" onClick={() => placeOrder('Standard')}>Place order</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CartFooter ({ subtotal, appliedCoupon, shipping, total, onCheckout }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      <div>
        <div className="text-sm">Subtotal: ${subtotal.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Shipping: ${shipping.toFixed(2)} • Coupon: {appliedCoupon || '—'}</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={onCheckout}>Checkout</button>
      </div>
    </div>
  )
}

// --- Small Support Card ---
function SupportCard ({ onContact }) {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h4 className="font-semibold">Customer Support</h4>
      <div className="text-sm text-gray-600 mt-2">Quick links: FAQs, Returns, Contact.</div>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={() => alert('Open FAQs (demo)')}>FAQs</button>
        <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={onContact}>Contact</button>
      </div>
    </div>
  )
}

/*
Notes & next steps you may want to implement before demo:
- Hook real auth (email/social OAuth) and profile management (addresses, payment methods)
- Replace mock data with product API and add server-side pagination
- Integrate payment gateways in checkout pages (stripe/paypal SDKs)
- Implement barcode scan (mobile) using an input or camera API
- Add order tracking UI connected to real order API
- Improve accessibility and keyboard navigation
*/
