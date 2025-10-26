import React from 'react'
import { useCart } from '../context/CartContext'
import { PRODUCTS } from '../mock/products'
import { Link } from 'react-router-dom'

export default function Cart(){
  const { items, update, clear } = useCart()
  const ids = Object.keys(items)
  const subtotal = ids.reduce((s,id)=> s + (PRODUCTS.find(p=>p.id===id)?.price || 0) * items[id], 0)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {!ids.length && <div className="p-6 card text-center">Your cart is empty. <Link to="/">Shop now</Link></div>}
      {ids.map(id => {
        const p = PRODUCTS.find(pp=>pp.id===id)
        return (
          <div key={id} className="flex items-center justify-between p-3 card mb-3">
            <div className="flex items-center gap-3">
              <img src={p.img} alt={p.title} className="w-20 h-20 object-cover rounded" />
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-500">${p.price}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="number" value={items[id]} onChange={e=>update(id, Number(e.target.value||0))} className="w-20 border rounded p-1" />
              <div className="font-semibold">${(p.price*items[id]).toFixed(2)}</div>
            </div>
          </div>
        )
      })}

      {ids.length>0 && (
        <div className="mt-4 card p-4 flex justify-between items-center">
          <div className="font-semibold">Subtotal: ${subtotal.toFixed(2)}</div>
          <div className="flex gap-2">
            <button onClick={clear} className="px-4 py-2 border rounded">Clear</button>
            <Link to="/checkout" className="px-4 py-2 bg-indigo-600 text-white rounded">Checkout</Link>
          </div>
        </div>
      )}
    </div>
  )
                                                                         }
