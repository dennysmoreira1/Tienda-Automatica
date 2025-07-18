import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaImage } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div style={{
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
                    <h2 style={{ marginBottom: '15px' }}>Tu carrito está vacío</h2>
                    <p style={{ color: '#8a8a9a', marginBottom: '30px' }}>
                        Agrega algunos productos para comenzar a comprar
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        <FaShoppingCart style={{ marginRight: '8px' }} />
                        Ver Productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Carrito de Compras</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                {/* Cart Items */}
                <div>
                    <div className="card">
                        <h2 style={{ marginBottom: '20px' }}>Productos ({items.length})</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {items.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    gap: '15px',
                                    padding: '15px',
                                    background: '#f8f9ff',
                                    borderRadius: '12px',
                                    alignItems: 'center'
                                }}>
                                    {/* Product Image */}
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: '#e8f4f8',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        {item.image ? (
                                            <img
                                                src={`http://localhost:5000${item.image}`}
                                                alt={item.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}

                                        {/* Fallback for no image */}
                                        <div style={{
                                            display: item.image ? 'none' : 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#8a8a9a',
                                            fontSize: '0.8rem'
                                        }}>
                                            <FaImage style={{ fontSize: '1.5rem', marginBottom: '5px', opacity: 0.5 }} />
                                            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Sin imagen</span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            marginBottom: '5px',
                                            fontSize: '1rem',
                                            color: '#2d5a4a'
                                        }}>
                                            {item.name}
                                        </h3>

                                        {item.category && (
                                            <div style={{
                                                background: '#f0f8f5',
                                                padding: '2px 6px',
                                                borderRadius: '8px',
                                                marginBottom: '8px',
                                                fontSize: '0.7rem',
                                                color: '#2d5a4a',
                                                alignSelf: 'flex-start',
                                                display: 'inline-block'
                                            }}>
                                                {item.category}
                                            </div>
                                        )}

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: '#7fd3b6',
                                                fontSize: '1.1rem'
                                            }}>
                                                ${item.price.toFixed(2)}
                                            </span>

                                            <span style={{
                                                background: item.stock > 0 ? '#e8f5e8' : '#ffebee',
                                                color: item.stock > 0 ? '#2e7d32' : '#d32f2f',
                                                padding: '2px 6px',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: '600'
                                            }}>
                                                Stock: {item.stock}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                style={{
                                                    background: '#7fd3b6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                -
                                            </button>

                                            <span style={{
                                                fontWeight: 'bold',
                                                minWidth: '30px',
                                                textAlign: 'center'
                                            }}>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                style={{
                                                    background: item.quantity >= item.stock ? '#ccc' : '#7fd3b6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <span style={{
                                            fontWeight: 'bold',
                                            color: '#7fd3b6',
                                            fontSize: '0.9rem'
                                        }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ff8a95',
                                            cursor: 'pointer',
                                            padding: '8px',
                                            borderRadius: '50%',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#ffebee';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'none';
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Summary */}
                <div>
                    <div className="card">
                        <h2 style={{ marginBottom: '20px' }}>Resumen del Pedido</h2>

                        <div style={{ marginBottom: '20px' }}>
                            {items.map(item => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                    fontSize: '0.9rem'
                                }}>
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            borderTop: '2px solid #e8f4f8',
                            paddingTop: '15px',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}>
                                <span>Total:</span>
                                <span style={{ color: '#7fd3b6' }}>${getTotalPrice().toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{
                            background: '#f0f8f5',
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            fontSize: '0.9rem',
                            color: '#5a5a7a'
                        }}>
                            <strong>Información importante:</strong>
                            <ul style={{ margin: '10px 0 0 20px' }}>
                                <li>El pago se realiza al recoger</li>
                                <li>Tiempo de preparación: 15-30 minutos</li>
                                <li>Recogida disponible en tienda</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/checkout" className="btn btn-primary">
                                Proceder al Checkout
                            </Link>
                            <Link to="/products" className="btn btn-secondary">
                                <FaArrowLeft style={{ marginRight: '8px' }} />
                                Seguir Comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 