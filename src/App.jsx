 
   

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

export default function App(){
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/product/:id" element={<Product/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/wishlist" element={<Wishlist/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/orders" element={<Orders/>} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
