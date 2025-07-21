import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import CustomerProfile from './pages/CustomerProfile';
import CustomerOrders from './pages/CustomerOrders';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <CustomerAuthProvider>
                <CartProvider>
                    <div className="App">
                        <Navbar />
                        <main className="container">
                            <Routes>
                                {/* Customer Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/login" element={<CustomerLogin />} />
                                <Route path="/register" element={<CustomerRegister />} />
                                <Route path="/profile" element={<CustomerProfile />} />
                                <Route path="/my-orders" element={<CustomerOrders />} />

                                {/* Admin Routes */}
                                <Route path="/admin/login" element={<AdminLogin />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/admin/products" element={<AdminProducts />} />
                                <Route path="/admin/orders" element={<AdminOrders />} />

                                {/* Fallback */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                    </div>
                </CartProvider>
            </CustomerAuthProvider>
        </AuthProvider>
    );
}

export default App; 