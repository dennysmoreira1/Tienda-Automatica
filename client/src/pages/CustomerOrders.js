import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClipboardList, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const CustomerOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getToken, isAuthenticated } = useCustomerAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        fetchOrders();
    }, [navigate, isAuthenticated, fetchOrders]);

    const fetchOrders = async () => {
        try {
            const token = getToken();
            const response = await axios.get('/api/customers/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaClock style={{ color: '#ffa726' }} />;
            case 'preparing':
                return <FaClipboardList style={{ color: '#42a5f5' }} />;
            case 'ready':
                return <FaCheckCircle style={{ color: '#66bb6a' }} />;
            case 'delivered':
                return <FaTruck style={{ color: '#7fd3b6' }} />;
            case 'cancelled':
                return <FaTimesCircle style={{ color: '#ef5350' }} />;
            default:
                return <FaClock style={{ color: '#8a8a9a' }} />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'preparing':
                return 'Preparando';
            case 'ready':
                return 'Listo para recoger';
            case 'delivered':
                return 'Entregado';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#fff3e0';
            case 'preparing':
                return '#e3f2fd';
            case 'ready':
                return '#e8f5e8';
            case 'delivered':
                return '#f0f8f5';
            case 'cancelled':
                return '#ffebee';
            default:
                return '#f8f9ff';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="loading">Cargando pedidos...</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Mis Pedidos</h1>

            {/* Order Confirmation Message */}
            {location.state?.orderNumber && (
                <div style={{
                    background: '#e8f5e8',
                    border: '1px solid #66bb6a',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎉</div>
                    <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>
                        ¡Pedido realizado con éxito!
                    </h3>
                    <p style={{ color: '#388e3c', marginBottom: '15px' }}>
                        Tu pedido #{location.state.orderNumber} ha sido confirmado.
                    </p>
                    <div style={{
                        background: '#fff',
                        padding: '15px',
                        borderRadius: '8px',
                        display: 'inline-block',
                        border: '2px solid #66bb6a'
                    }}>
                        <strong>Número de pedido:</strong> {location.state.orderNumber}
                    </div>
                </div>
            )}

            {orders.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
                    <h2 style={{ marginBottom: '15px' }}>No tienes pedidos aún</h2>
                    <p style={{ color: '#8a8a9a', marginBottom: '30px' }}>
                        ¡Haz tu primer pedido y comienza a disfrutar de nuestros productos!
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/products')}
                    >
                        Ver Productos
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((order) => (
                        <div key={order.id} className="card">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '20px'
                            }}>
                                <div>
                                    <h3 style={{ marginBottom: '5px' }}>
                                        Pedido #{order.id.toString().padStart(4, '0')}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '10px'
                                    }}>
                                        <FaCalendarAlt style={{ color: '#8a8a9a' }} />
                                        <span style={{ color: '#8a8a9a', fontSize: '0.9rem' }}>
                                            {formatDate(order.created_at)}
                                        </span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <FaDollarSign style={{ color: '#7fd3b6' }} />
                                        <span style={{ fontWeight: 'bold', color: '#7fd3b6' }}>
                                            ${order.total_amount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 15px',
                                    borderRadius: '20px',
                                    background: getStatusColor(order.status),
                                    border: '1px solid #e0e0e0'
                                }}>
                                    {getStatusIcon(order.status)}
                                    <span style={{
                                        fontWeight: '600',
                                        color: order.status === 'cancelled' ? '#d32f2f' : '#2d5a4a'
                                    }}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                background: '#f8f9ff',
                                padding: '15px',
                                borderRadius: '12px',
                                marginBottom: '15px'
                            }}>
                                <h4 style={{ marginBottom: '10px', color: '#2d5a4a' }}>
                                    Productos:
                                </h4>
                                <div style={{ fontSize: '0.9rem', color: '#5a5a7a' }}>
                                    {order.items ? order.items.split(',').map((item, index) => (
                                        <div key={index} style={{ marginBottom: '5px' }}>
                                            • {item.trim()}
                                        </div>
                                    )) : 'No hay detalles disponibles'}
                                </div>
                            </div>

                            {order.status === 'ready' && (
                                <div style={{
                                    background: '#e8f5e8',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: '1px solid #66bb6a',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#2e7d32'
                                    }}>
                                        <FaCheckCircle />
                                        <strong>¡Tu pedido está listo para recoger!</strong>
                                    </div>
                                    <p style={{ margin: '10px 0 0 0', color: '#388e3c', fontSize: '0.9rem' }}>
                                        Acércate a nuestra tienda para recoger tu pedido.
                                        Recuerda traer tu identificación.
                                    </p>
                                </div>
                            )}

                            {order.status === 'pending' && (
                                <div style={{
                                    background: '#fff3e0',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: '1px solid #ffcc80'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#e65100'
                                    }}>
                                        <FaClock />
                                        <strong>Tu pedido está siendo procesado</strong>
                                    </div>
                                    <p style={{ margin: '10px 0 0 0', color: '#f57c00', fontSize: '0.9rem' }}>
                                        Te notificaremos cuando esté listo para recoger.
                                    </p>
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.8rem',
                                color: '#8a8a9a'
                            }}>
                                <span>ID del pedido: {order.id}</span>
                                <span>Estado: {getStatusText(order.status)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{
                marginTop: '30px',
                padding: '20px',
                background: '#f0f8f5',
                borderRadius: '12px',
                textAlign: 'center'
            }}>
                <h4 style={{ marginBottom: '15px', color: '#2d5a4a' }}>
                    📞 ¿Necesitas ayuda?
                </h4>
                <p style={{ color: '#5a5a7a', marginBottom: '15px' }}>
                    Si tienes alguna pregunta sobre tus pedidos, contáctanos:
                </p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <strong>Teléfono:</strong> (123) 456-7890
                    </div>
                    <div>
                        <strong>Email:</strong> info@tienda.com
                    </div>
                    <div>
                        <strong>Horario:</strong> 8:00 AM - 8:00 PM
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrders; 