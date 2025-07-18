import React, { useState, useEffect } from 'react';
import { FaCheck, FaClock, FaBox, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error al cargar los pedidos');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            toast.success('Estado del pedido actualizado');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Error al actualizar el estado del pedido');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'preparing': return 'status-preparing';
            case 'ready': return 'status-ready';
            case 'completed': return 'status-completed';
            default: return 'status-pending';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'preparing': return 'Preparando';
            case 'ready': return 'Listo';
            case 'completed': return 'Completado';
            default: return 'Pendiente';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FaClock />;
            case 'preparing': return <FaBox />;
            case 'ready': return <FaCheck />;
            case 'completed': return <FaCheckCircle />;
            default: return <FaClock />;
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'pending': return 'preparing';
            case 'preparing': return 'ready';
            case 'ready': return 'completed';
            default: return null;
        }
    };

    const filteredOrders = selectedStatus
        ? orders.filter(order => order.status === selectedStatus)
        : orders;

    if (loading) {
        return <div className="loading">Cargando pedidos...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Gestionar Pedidos</h1>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label htmlFor="status-filter">Filtrar por estado:</label>
                    <select
                        id="status-filter"
                        className="form-control"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="preparing">Preparando</option>
                        <option value="ready">Listos</option>
                        <option value="completed">Completados</option>
                    </select>
                </div>
            </div>

            {/* Orders Summary */}
            <div className="admin-dashboard" style={{ marginBottom: '30px' }}>
                <div className="stats-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
                    <div className="stats-number">{orders.length}</div>
                    <div className="stats-label">Total de Pedidos</div>
                </div>

                <div className="stats-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏳</div>
                    <div className="stats-number">
                        {orders.filter(order => order.status === 'pending').length}
                    </div>
                    <div className="stats-label">Pendientes</div>
                </div>

                <div className="stats-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔄</div>
                    <div className="stats-number">
                        {orders.filter(order => order.status === 'preparing').length}
                    </div>
                    <div className="stats-label">Preparando</div>
                </div>

                <div className="stats-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✅</div>
                    <div className="stats-number">
                        {orders.filter(order => order.status === 'ready').length}
                    </div>
                    <div className="stats-label">Listos</div>
                </div>
            </div>

            {/* Orders List */}
            <div className="card">
                <h2>Lista de Pedidos ({filteredOrders.length})</h2>

                {filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No hay pedidos</h3>
                        <p>{selectedStatus ? `No hay pedidos con estado "${getStatusText(selectedStatus)}"` : 'Los pedidos aparecerán aquí cuando los clientes realicen compras'}</p>
                    </div>
                ) : (
                    <div>
                        {filteredOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <div className="order-number">Pedido #{order.id}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                            <strong>Cliente:</strong> {order.customer_name}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                            <strong>Teléfono:</strong> {order.customer_phone}
                                        </div>
                                        {order.customer_email && (
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                                <strong>Email:</strong> {order.customer_email}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className={`order-status ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)} {getStatusText(order.status)}
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#007bff', marginTop: '5px' }}>
                                            ${order.total_amount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <strong>Productos:</strong>
                                    <div style={{
                                        background: '#f8f9fa',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        marginTop: '5px',
                                        fontSize: '0.9rem'
                                    }}>
                                        {order.items || 'Sin detalles de productos'}
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                        <strong>Fecha:</strong> {new Date(order.created_at).toLocaleString('es-ES')}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {getNextStatus(order.status) && (
                                            <button
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.8rem', padding: '8px 15px' }}
                                                onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                                            >
                                                {getStatusIcon(getNextStatus(order.status))}
                                                Marcar como {getStatusText(getNextStatus(order.status))}
                                            </button>
                                        )}

                                        {order.status === 'ready' && (
                                            <button
                                                className="btn btn-success"
                                                style={{ fontSize: '0.8rem', padding: '8px 15px' }}
                                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                                            >
                                                <FaCheckCircle /> Marcar como Completado
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div style={{ marginTop: '30px' }}>
                <h2 className="section-title">Instrucciones de Gestión</h2>
                <div className="card">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div>
                            <h4>📋 Proceso de Pedidos</h4>
                            <ol style={{ margin: '10px 0 0 20px', fontSize: '0.9rem' }}>
                                <li><strong>Pendiente:</strong> Pedido recibido, pendiente de preparación</li>
                                <li><strong>Preparando:</strong> Productos siendo preparados</li>
                                <li><strong>Listo:</strong> Pedido preparado, listo para recoger</li>
                                <li><strong>Completado:</strong> Pedido entregado al cliente</li>
                            </ol>
                        </div>
                        <div>
                            <h4>⏰ Tiempos Estimados</h4>
                            <ul style={{ margin: '10px 0 0 20px', fontSize: '0.9rem' }}>
                                <li>Preparación: 15-30 minutos</li>
                                <li>Notificar al cliente cuando esté listo</li>
                                <li>Confirmar entrega al completar</li>
                            </ul>
                        </div>
                        <div>
                            <h4>📞 Comunicación</h4>
                            <ul style={{ margin: '10px 0 0 20px', fontSize: '0.9rem' }}>
                                <li>Contactar al cliente cuando el pedido esté listo</li>
                                <li>Verificar identidad al entregar</li>
                                <li>Cobrar al momento de la entrega</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders; 