import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const { login } = useCustomerAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/customers/login', formData);

            login(response.data.customer, response.data.token);
            toast.success(`¡Bienvenido de vuelta, ${response.data.customer.name}!`);
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card">
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔐</div>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Iniciar Sesión</h1>
                        <p style={{ color: '#8a8a9a' }}>Accede a tu cuenta para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#8a8a9a'
                                }} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#8a8a9a'
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Tu contraseña"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '45px', paddingRight: '45px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#8a8a9a'
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
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
                            <strong>¿Por qué iniciar sesión?</strong>
                            <ul style={{ margin: '10px 0 0 20px' }}>
                                <li>Ver tu historial de pedidos</li>
                                <li>Proceso de compra más rápido</li>
                                <li>Recibir notificaciones</li>
                                <li>Acceso a ofertas especiales</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginBottom: '15px' }}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#8a8a9a' }}>
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" style={{ color: '#7fd3b6', textDecoration: 'none', fontWeight: '600' }}>
                                Regístrate aquí
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin; 