import React from 'react'
import { useParams } from 'react-router-dom'
import { PRODUCTS } from '../mock/products'
import { useCart } from '../context/CartContext'

export default function Product(){
  const { id } = useParams()
  const product = PRODUCTS.find(p => p.id === id)
  const { add } = useCart()
  if (!product) return <div className="p-6">Product not found</div>
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6 card p-4">
        <img src={product.img} alt={product.title} className="w-full h-96 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="text-gray-600 mt-2">{product.brand} • {product.category}</div>
          <div className="mt-4 text-xl font-semibold text-indigo-700">${product.price.toFixed(2)}</div>
          <p className="mt-4 text-gray-700">Short product description. Replace with Firestore 'description' field for real content.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => add(product)} className="bg-indigo-600 text-white px-4 py-2 rounded">Add to cart</button>
            <button className="border px-4 py-2 rounded">Buy now</button>
          </div>
        </div>
      </div>
    </div>
  )
}
