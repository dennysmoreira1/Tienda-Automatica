import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserCircle, FaClipboardList } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Navbar = () => {
    const { getTotalItems } = useCart();
    const { user, logout: adminLogout } = useAuth();
    const { customer, logout: customerLogout } = useCustomerAuth();
    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith('/admin');
    const isCustomerRoute = location.pathname.startsWith('/profile') ||
        location.pathname.startsWith('/my-orders') ||
        location.pathname === '/login' ||
        location.pathname === '/register';

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
                                    <Link to="/cart" style={{ position: 'relative' }}>
                                        <FaShoppingCart />
                                        {getTotalItems() > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                background: '#ff8a95',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {getTotalItems()}
                                            </span>
                                        )}
                                    </Link>
                                </li>

                                {/* Customer Authentication */}
                                {customer ? (
                                    <>
                                        <li>
                                            <Link to="/my-orders">
                                                <FaClipboardList /> Mis Pedidos
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/profile">
                                                <FaUserCircle /> {customer.name}
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={customerLogout}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#2d5a4a',
                                                    cursor: 'pointer',
                                                    padding: '8px 15px',
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                <FaSignOutAlt /> Salir
                                            </button>
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