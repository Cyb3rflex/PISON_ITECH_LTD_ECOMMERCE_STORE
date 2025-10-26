import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react'

const PRODUCTS = [
  { id: 'p1', title: 'Learn React (e-book)', img: 'https://placehold.co/300x200?text=React+Ebook', category: 'E-books & Printed Books', format: 'ebook', price: 9.99, brand: 'CodePress', rating: 4.6, stock: 999 },
  { id: 'p2', title: 'Wireless Headphones', img: 'https://placehold.co/300x200?text=Headphones', category: 'Electronics', format: 'physical', price: 49.99, brand: 'Soundly', rating: 4.2, stock: 25 },
  { id: 'p3', title: 'Kitchen Knife Set', img: 'https://placehold.co/300x200?text=Kitchen+Set', category: 'Household Utensils', format: 'physical', price: 29.99, brand: 'SharpHome', rating: 4.8, stock: 7 },
  { id: 'p4', title: 'Portable Drill', img: 'https://placehold.co/300x200?text=Drill', category: 'Equipment', format: 'physical', price: 89.99, brand: 'BuildIt', rating: 4.1, stock: 5 },
  { id: 'p5', title: 'Mystery Box', img: 'https://placehold.co/300x200?text=Mystery+Box', category: 'General Merchandise', format: 'physical', price: 14.99, brand: 'Bazar', rating: 3.9, stock: 0 }
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState({})
  const [showCart, setShowCart] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
  }, [query])

  const addToCart = (p) => {
    setCart(prev => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }))
  }

  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id)
    return sum + (product ? product.price * qty : 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 text-gray-800">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold cursor-pointer">PinStore</div>
          <div className="hidden md:flex gap-6 items-center">
            <button className="hover:text-yellow-200">Home</button>
            <button className="hover:text-yellow-200">Catalog</button>
            <button className="hover:text-yellow-200">Wishlist</button>
            <button className="hover:text-yellow-200">Orders</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 rounded-md text-gray-800 w-40 sm:w-56 md:w-64" />
            </div>
            <ShoppingCart className="cursor-pointer hover:text-yellow-200" onClick={() => setShowCart(true)} />
            <User className="cursor-pointer hover:text-yellow-200" />
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2">
            <button className="py-1 hover:bg-white/10">Home</button>
            <button className="py-1 hover:bg-white/10">Catalog</button>
            <button className="py-1 hover:bg-white/10">Wishlist</button>
            <button className="py-1 hover:bg-white/10">Orders</button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <motion.div key={p.id} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
            <img src={p.img} alt={p.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <Heart size={18} className="text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>
              <p className="text-sm text-gray-500">{p.category}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-indigo-700">${p.price.toFixed(2)}</span>
                <button onClick={() => addToCart(p)} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 flex items-center gap-1">
                  <ShoppingCart size={16} /> Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl">Your Cart</h2>
                <button onClick={() => setShowCart(false)}><X /></button>
              </div>
              {Object.keys(cart).length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {Object.entries(cart).map(([id, qty]) => {
                    const p = PRODUCTS.find(pr => pr.id === id)
                    if (!p) return null
                    return (
                      <div key={id} className="flex justify-between items-center border-b pb-2">
                        <div className="flex gap-3 items-center">
                          <img src={p.img} alt={p.title} className="w-12 h-12 rounded" />
                          <div>
                            <div className="font-semibold text-sm">{p.title}</div>
                            <div className="text-gray-500 text-xs">${p.price}</div>
                          </div>
                        </div>
                        <div className="text-sm">x{qty}</div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="mt-4 flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => setShowCart(false)} className="flex-1 py-2 border rounded hover:bg-gray-100">Continue Shopping</button>
                <button className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Checkout</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-10 text-center text-sm py-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        © 2025 PinsonStore | Frontend Preview
      </footer>
    </div>
  )
}

