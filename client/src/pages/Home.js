import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaClock, FaUser, FaClipboardList, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useCustomerAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data); // Mostrar todos los productos en la Home
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error al cargar los productos');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #e8f4f8 0%, #f0f8f5 100%)',
                padding: '60px 20px',
                borderRadius: '20px',
                marginBottom: '40px',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '20px',
                    background: 'linear-gradient(135deg, #2d5a4a, #7fd3b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                }}>
                    🛒 Tienda Automática
                </h1>
                <p style={{
                    fontSize: '1.2rem',
                    color: '#5a5a7a',
                    marginBottom: '30px',
                    maxWidth: '600px',
                    margin: '0 auto 30px'
                }}>
                    Compra desde casa y recoge en tienda. Sistema de cuentas para seguimiento completo de pedidos.
                </p>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/products" className="btn btn-primary">
                        <FaShoppingCart style={{ marginRight: '8px' }} />
                        Ver Productos
                    </Link>
                    {!isAuthenticated() ? (
                        <>
                            <Link to="/register" className="btn btn-secondary">
                                <FaUser style={{ marginRight: '8px' }} />
                                Crear Cuenta
                            </Link>
                            <Link to="/login" className="btn btn-secondary">
                                Iniciar Sesión
                            </Link>
                        </>
                    ) : (
                        <Link to="/my-orders" className="btn btn-secondary">
                            <FaClipboardList style={{ marginRight: '8px' }} />
                            Mis Pedidos
                        </Link>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>¿Por qué usar nuestro sistema?</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👤</div>
                        <h3>Cuentas de Usuario</h3>
                        <p style={{ color: '#8a8a9a' }}>
                            Crea tu cuenta para tener un historial completo de pedidos,
                            información guardada y proceso de compra más rápido.
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📱</div>
                        <h3>Pedidos desde Casa</h3>
                        <p style={{ color: '#8a8a9a' }}>
                            Selecciona tus productos desde la comodidad de tu hogar
                            y recoge cuando esté listo.
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⏰</div>
                        <h3>Seguimiento en Tiempo Real</h3>
                        <p style={{ color: '#8a8a9a' }}>
                            Ve el estado de tus pedidos en tiempo real:
                            pendiente, preparando, listo para recoger.
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Benefits Section */}
            {!isAuthenticated() && (
                <div style={{
                    background: 'linear-gradient(135deg, #f0f8f5 0%, #e8f4f8 100%)',
                    padding: '40px',
                    borderRadius: '20px',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginBottom: '20px' }}>🎁 Beneficios de Crear una Cuenta</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <FaClipboardList style={{ fontSize: '2rem', color: '#7fd3b6', marginBottom: '10px' }} />
                            <h4>Historial Completo</h4>
                            <p style={{ fontSize: '0.9rem', color: '#8a8a9a' }}>
                                Accede a todos tus pedidos anteriores y su estado
                            </p>
                        </div>

                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <FaUser style={{ fontSize: '2rem', color: '#7fd3b6', marginBottom: '10px' }} />
                            <h4>Información Guardada</h4>
                            <p style={{ fontSize: '0.9rem', color: '#8a8a9a' }}>
                                No vuelvas a llenar tus datos en cada compra
                            </p>
                        </div>

                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <FaStar style={{ fontSize: '2rem', color: '#7fd3b6', marginBottom: '10px' }} />
                            <h4>Ofertas Exclusivas</h4>
                            <p style={{ fontSize: '0.9rem', color: '#8a8a9a' }}>
                                Recibe descuentos y promociones especiales
                            </p>
                        </div>

                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <FaClock style={{ fontSize: '2rem', color: '#7fd3b6', marginBottom: '10px' }} />
                            <h4>Notificaciones</h4>
                            <p style={{ fontSize: '0.9rem', color: '#8a8a9a' }}>
                                Te avisamos cuando tu pedido esté listo
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary">
                            Crear Cuenta Gratis
                        </Link>
                        <Link to="/login" className="btn btn-secondary">
                            Ya tengo cuenta
                        </Link>
                    </div>
                </div>
            )}

            {/* How It Works Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>¿Cómo funciona?</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{
                            background: '#7fd3b6',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 15px',
                            fontWeight: 'bold'
                        }}>
                            1
                        </div>
                        <h3>Regístrate</h3>
                        <p style={{ color: '#8a8a9a' }}>
                            Crea tu cuenta gratuita con tu información de contacto
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{
                            background: '#7fd3b6',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 15px',
                            fontWeight: 'bold'
                        }}>
                            2
                        </div>
                        <h3>Selecciona Productos</h3>
                        <p style={{ color: '#8a8a9a' }}>
                            Explora nuestro catálogo y agrega productos a tu carrito
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{
                            background: '#7fd3b6',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 15px',
                            fontWeight: 'bold'
                        }}>
                            3
                        </div>
                        <h3>Realiza el Pedido</h3>
                        <p style={{ color: '#8a8a9a' }}>
                            Confirma tu pedido y espera la notificación
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{
                            background: '#7fd3b6',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 15px',
                            fontWeight: 'bold'
                        }}>
                            4
                        </div>
                        <h3>Recoge tu Pedido</h3>
                        <p style={{ color: '#8a8a9a' }}>
                            Ve a la tienda cuando te avisemos que está listo
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={{
                background: 'linear-gradient(135deg, #2d5a4a 0%, #7fd3b6 100%)',
                color: 'white',
                padding: '40px',
                borderRadius: '20px',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '15px' }}>¡Comienza ahora!</h2>
                <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
                    Únete a cientos de clientes satisfechos que ya disfrutan de nuestro servicio
                </p>
                <Link to="/products" className="btn" style={{
                    background: 'white',
                    color: '#2d5a4a',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    display: 'inline-block'
                }}>
                    Ver Productos
                </Link>
            </div>

            {/* Featured Products */}
            <div>
                <h2 className="section-title">Productos Destacados</h2>
                <div className="product-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <img
                                src={product.image || 'https://via.placeholder.com/300x200?text=Producto'}
                                alt={product.name}
                                className="product-image"
                            />
                            <div className="product-info">
                                <h3 className="product-title">{product.name}</h3>
                                <p className="product-description">{product.description}</p>
                                <div className="product-price">${product.price.toFixed(2)}</div>
                                <Link to="/products" className="btn btn-primary" style={{ width: '100%' }}>
                                    Ver Producto
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Link to="/products" className="btn btn-secondary">
                        Ver Todos los Productos
                    </Link>
                </div>
            </div>

            {/* Contact Info */}
            <div style={{ marginTop: '40px', padding: '30px', background: '#f8f9fa', borderRadius: '10px' }}>
                <h2 className="section-title" style={{ textAlign: 'center' }}>Información de Contacto</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
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
                </div>
            </div>
        </div>
    );
};

export default Home; 