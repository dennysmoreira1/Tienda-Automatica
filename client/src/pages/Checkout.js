import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaUser } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCart();
    const { customer, isAuthenticated } = useCustomerAuth();
    const [loading, setLoading] = useState(false);

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    if (!isAuthenticated()) {
        return (
            <div style={{
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
                    <h2>Inicia sesión para continuar</h2>
                    <p style={{ color: '#8a8a9a', marginBottom: '30px' }}>
                        Necesitas tener una cuenta para realizar pedidos y hacer seguimiento de tus compras.
                    </p>
                    <div className="btn-group">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/login')}
                        >
                            <FaUser style={{ marginRight: '8px' }} />
                            Iniciar Sesión
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/register')}
                        >
                            Crear Cuenta
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                total_amount: getTotalPrice(),
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            // Add authorization header
            const token = localStorage.getItem('customerToken');
            const response = await axios.post('/api/orders', orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success('¡Pedido realizado con éxito!');
            clearCart();

            // Show order confirmation
            navigate('/my-orders', {
                state: {
                    orderNumber: response.data.order_number,
                    orderId: response.data.id
                }
            });

        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Error al procesar el pedido. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">Finalizar Pedido</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Customer Information */}
                <div>
                    <div className="card">
                        <h2 style={{ marginBottom: '20px' }}>Información de Contacto</h2>

                        <div style={{
                            background: '#f0f8f5',
                            padding: '20px',
                            borderRadius: '15px',
                            marginBottom: '20px'
                        }}>
                            <h4 style={{ marginBottom: '15px', color: '#2d5a4a' }}>
                                <FaUser style={{ marginRight: '8px' }} />
                                Datos de tu cuenta
                            </h4>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Nombre:</strong> {customer.name}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Email:</strong> {customer.email}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Teléfono:</strong> {customer.phone}
                            </div>
                            {customer.address && (
                                <div>
                                    <strong>Dirección:</strong> {customer.address}
                                </div>
                            )}
                        </div>

                        <div style={{
                            background: '#fff3e0',
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            fontSize: '0.9rem',
                            color: '#e65100'
                        }}>
                            <strong>Información importante:</strong>
                            <ul style={{ margin: '10px 0 0 20px' }}>
                                <li>Te contactaremos cuando tu pedido esté listo</li>
                                <li>El pago se realiza al recoger el pedido</li>
                                <li>Recogida disponible en tienda</li>
                                <li>Tiempo de preparación: 15-30 minutos</li>
                                <li>Puedes ver el estado de tu pedido en "Mis Pedidos"</li>
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="btn-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                >
                                    {loading ? 'Procesando...' : (
                                        <>
                                            <FaCheck style={{ marginRight: '8px' }} />
                                            Confirmar Pedido
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/cart')}
                                    style={{ width: '100%' }}
                                >
                                    <FaArrowLeft style={{ marginRight: '8px' }} />
                                    Volver al Carrito
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
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
                            background: '#e7f3ff',
                            padding: '15px',
                            borderRadius: '12px',
                            border: '1px solid #b3d9ff'
                        }}>
                            <h4 style={{ marginBottom: '10px', color: '#0056b3' }}>
                                📍 Recogida en Tienda
                            </h4>
                            <p style={{ margin: '0', fontSize: '0.9rem', color: '#0056b3' }}>
                                Av. Principal #123, Ciudad<br />
                                Te avisaremos cuando esté listo
                            </p>
                        </div>

                        <div style={{
                            marginTop: '20px',
                            padding: '15px',
                            background: '#f8f9ff',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            color: '#5a5a7a'
                        }}>
                            <strong>Ventajas de tu cuenta:</strong>
                            <ul style={{ margin: '10px 0 0 20px' }}>
                                <li>Historial completo de pedidos</li>
                                <li>Notificaciones automáticas</li>
                                <li>Proceso de compra más rápido</li>
                                <li>Acceso a ofertas especiales</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 