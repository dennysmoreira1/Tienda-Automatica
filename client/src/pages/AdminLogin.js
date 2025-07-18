import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
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

        if (!formData.username || !formData.password) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/admin/login', formData);

            login(response.data.user, response.data.token);
            toast.success('Inicio de sesión exitoso');
            navigate('/admin');

        } catch (error) {
            console.error('Login error:', error);
            toast.error('Credenciales incorrectas');
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
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Panel de Administración</h1>
                        <p style={{ color: '#666' }}>Inicia sesión para gestionar tu tienda</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Usuario</label>
                            <div style={{ position: 'relative' }}>
                                <FaUser style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#666'
                                }} />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control"
                                    placeholder="Ingresa tu usuario"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '35px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#666'
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Ingresa tu contraseña"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '35px', paddingRight: '40px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#666'
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginTop: '20px' }}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div style={{
                        marginTop: '30px',
                        padding: '15px',
                        background: '#f8f9fa',
                        borderRadius: '5px',
                        fontSize: '0.9rem',
                        color: '#666'
                    }}>
                        <strong>Credenciales de prueba:</strong><br />
                        Usuario: <code>admin</code><br />
                        Contraseña: <code>admin123</code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin; 