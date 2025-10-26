import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { PRODUCTS } from '../mock/products'
import { AnimatePresence, motion } from 'framer-motion'

export default function Checkout(){
  const { items, clear } = useCart()
  const ids = Object.keys(items)
  const subtotal = ids.reduce((s,id)=> s + (PRODUCTS.find(p=>p.id===id)?.price || 0) * items[id], 0)

  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(null)

  const payNow = async () => {
    setProcessing(true)
    // Simulate client-side Stripe checkout
    await new Promise(r => setTimeout(r, 1600))
    setProcessing(false)
    setSuccess({ id: 'pi_mock_' + Date.now(), amount: subtotal, createdAt: new Date().toISOString() })
    clear()
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {!success ? (
        <div className="card p-4">
          <div className="mb-4">
            <label className="block text-sm">Shipping address</label>
            <input className="w-full p-2 border rounded mt-1" placeholder="Full name, address, city, zip" />
          </div>

          <div className="mb-4">
            <label className="block text-sm">Payment (simulation)</label>
            <div className="p-3 border rounded text-sm text-gray-600">Card details simulated. Click Pay Now to continue.</div>
          </div>

          <div className="flex justify-between items-center font-semibold mb-4"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex gap-3">
            <button onClick={payNow} disabled={processing || subtotal===0} className="flex-1 py-2 bg-indigo-600 text-white rounded disabled:opacity-60">{processing ? 'Processing…' : 'Pay Now'}</button>
            <button className="flex-1 py-2 border rounded" onClick={() => alert('Return to cart')}>Back to cart</button>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card p-6 text-center">
            <h3 className="text-xl font-bold text-green-600">Payment Successful</h3>
            <p className="mt-2 text-gray-600">Mock payment id: <code className="bg-gray-100 px-2 py-1 rounded">{success.id}</code></p>
            <p className="mt-2">Amount: ${success.amount.toFixed(2)}</p>
            <p className="mt-2 text-sm text-gray-500">Order will appear in Orders page (demo).</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
            }
