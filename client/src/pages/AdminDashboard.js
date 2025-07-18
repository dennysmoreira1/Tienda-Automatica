import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBox, FaDollarSign, FaClock, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ordersResponse, productsResponse] = await Promise.all([
                    axios.get('/api/orders'),
                    axios.get('/api/products')
                ]);

                const orders = ordersResponse.data;
                const products = productsResponse.data;

                const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
                const pendingOrders = orders.filter(order => order.status === 'pending').length;

                setStats({
                    totalOrders: orders.length,
                    pendingOrders,
                    totalProducts: products.length,
                    totalRevenue
                });

                setRecentOrders(orders.slice(0, 5)); // Show last 5 orders
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Error al cargar los datos del dashboard');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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

    if (loading) {
        return <div className="loading">Cargando dashboard...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
                <div style={{ color: '#666' }}>
                    Bienvenido, <strong>{user?.username}</strong>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="admin-dashboard">
                <div className="stats-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
                    <div className="stats-number">{stats.totalOrders}</div>
                    <div className="stats-label">Total de Pedidos</div>
                </div>

                <div className="stats-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏳</div>
                    <div className="stats-number">{stats.pendingOrders}</div>
                    <div className="stats-label">Pedidos Pendientes</div>
                </div>

                <div className="stats-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛍️</div>
                    <div className="stats-number">{stats.totalProducts}</div>
                    <div className="stats-label">Productos</div>
                </div>

                <div className="stats-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💰</div>
                    <div className="stats-number">${stats.totalRevenue.toFixed(2)}</div>
                    <div className="stats-label">Ingresos Totales</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '30px' }}>
                <h2 className="section-title">Acciones Rápidas</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <Link to="/admin/products" className="btn btn-primary" style={{ textAlign: 'center' }}>
                        <FaBox style={{ marginRight: '8px' }} />
                        Gestionar Productos
                    </Link>
                    <Link to="/admin/orders" className="btn btn-secondary" style={{ textAlign: 'center' }}>
                        <FaShoppingCart style={{ marginRight: '8px' }} />
                        Ver Pedidos
                    </Link>
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="section-title" style={{ margin: 0 }}>Pedidos Recientes</h2>
                    <Link to="/admin/orders" className="btn btn-secondary">
                        Ver Todos
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No hay pedidos aún</h3>
                        <p>Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
                    </div>
                ) : (
                    <div>
                        {recentOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <div className="order-number">Pedido #{order.id}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                            {order.customer_name} • {order.customer_phone}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className={`order-status ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                            ${order.total_amount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <strong>Productos:</strong> {order.items || 'Sin detalles'}
                                </div>

                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                    {new Date(order.created_at).toLocaleString('es-ES')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Store Information */}
            <div style={{ marginTop: '40px' }}>
                <h2 className="section-title">Información de la Tienda</h2>
                <div className="card">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div>
                            <h4>📍 Dirección</h4>
                            <p>Av. Principal #123<br />Ciudad, Estado</p>
                        </div>
                        <div>
                            <h4>📞 Teléfono</h4>
                            <p>(123) 456-7890</p>
                        </div>
                        <div>
                            <h4>🕒 Horarios</h4>
                            <p>Lun - Sáb: 8:00 - 20:00<br />Domingo: 9:00 - 18:00</p>
                        </div>
                        <div>
                            <h4>💡 Consejos</h4>
                            <ul style={{ margin: '0', paddingLeft: '20px' }}>
                                <li>Revisa los pedidos regularmente</li>
                                <li>Actualiza el estado de los pedidos</li>
                                <li>Mantén el inventario actualizado</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 