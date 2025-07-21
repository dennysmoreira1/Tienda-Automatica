import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserCircle, FaClipboardList } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Navbar = () => {
    const { getTotalItems } = useCart();
    const { logout: adminLogout } = useAuth();
    const { customer, logout: customerLogout } = useCustomerAuth();
    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <nav className="navbar">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="navbar-brand">
                        🛒 Tienda Automática
                    </Link>

                    <ul className="navbar-nav">
                        {!isAdminRoute ? (
                            <>
                                <li>
                                    <Link to="/">Inicio</Link>
                                </li>
                                <li>
                                    <Link to="/products">Productos</Link>
                                </li>
                                <li>
                                    <Link to="/cart">
                                        <FaShoppingCart /> Carrito ({getTotalItems()})
                                    </Link>
                                </li>
                                {customer ? (
                                    <>
                                        <li>
                                            <Link to="/profile">
                                                <FaUserCircle /> Mi Perfil
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/my-orders">
                                                <FaClipboardList /> Mis Pedidos
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/" onClick={customerLogout}>
                                                <FaSignOutAlt /> Salir
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link to="/login">
                                                <FaUser /> Iniciar Sesión
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/register">
                                                <FaUser /> Registrarse
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <Link to="/admin/login">
                                        <FaUser /> Admin
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/admin">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/admin/products">Productos</Link>
                                </li>
                                <li>
                                    <Link to="/admin/orders">Pedidos</Link>
                                </li>
                                <li>
                                    <Link to="/" onClick={adminLogout}>
                                        <FaSignOutAlt /> Salir
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 