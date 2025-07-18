import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const CustomerRegister = () => {
    const navigate = useNavigate();
    const { register } = useCustomerAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            toast.error('Por favor completa todos los campos obligatorios');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return false;
        }

        if (formData.password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Por favor ingresa un email válido');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await axios.post('/api/customers/register', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                address: formData.address
            });

            register(response.data.customer, response.data.token);
            toast.success('¡Registro exitoso! Bienvenido a nuestra tienda');
            navigate('/');

        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.error || 'Error al registrar usuario';
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
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <div className="card">
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👤</div>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Crear Cuenta</h1>
                        <p style={{ color: '#8a8a9a' }}>Únete a nuestra tienda y disfruta de compras más rápidas</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">
                                Nombre completo <span style={{ color: '#ff8a95' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaUser style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#8a8a9a'
                                }} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    placeholder="Tu nombre completo"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                Email <span style={{ color: '#ff8a95' }}>*</span>
                            </label>
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
                            <label htmlFor="phone">
                                Teléfono <span style={{ color: '#ff8a95' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaPhone style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#8a8a9a'
                                }} />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-control"
                                    placeholder="Tu número de teléfono"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Dirección (opcional)</label>
                            <div style={{ position: 'relative' }}>
                                <FaMapMarkerAlt style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#8a8a9a'
                                }} />
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="form-control"
                                    placeholder="Tu dirección"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '45px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                Contraseña <span style={{ color: '#ff8a95' }}>*</span>
                            </label>
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
                                    placeholder="Mínimo 6 caracteres"
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirmar contraseña <span style={{ color: '#ff8a95' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#8a8a9a'
                                }} />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Repite tu contraseña"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '45px' }}
                                    required
                                />
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
                            <strong>Beneficios de registrarte:</strong>
                            <ul style={{ margin: '10px 0 0 20px' }}>
                                <li>Historial de pedidos</li>
                                <li>Proceso de compra más rápido</li>
                                <li>Notificaciones de estado</li>
                                <li>Ofertas exclusivas</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginBottom: '15px' }}
                        >
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#8a8a9a' }}>
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" style={{ color: '#7fd3b6', textDecoration: 'none', fontWeight: '600' }}>
                                Inicia sesión aquí
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegister; 