import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const CustomerProfile = () => {
    const navigate = useNavigate();
    const { customer, updateProfile, getToken } = useCustomerAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: customer?.name || '',
        phone: customer?.phone || '',
        address: customer?.address || ''
    });

    useEffect(() => {
        if (!customer) {
            navigate('/login');
            return;
        }

        setProfileData({
            name: customer.name,
            phone: customer.phone,
            address: customer.address || ''
        });
    }, [customer, navigate]);

    const handleInputChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        if (!profileData.name || !profileData.phone) {
            toast.error('Por favor completa los campos obligatorios');
            return;
        }

        setLoading(true);

        try {
            const token = getToken();
            await axios.put('/api/customers/profile', profileData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            updateProfile(profileData);
            setEditing(false);
            toast.success('Perfil actualizado exitosamente');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfileData({
            name: customer.name,
            phone: customer.phone,
            address: customer.address || ''
        });
        setEditing(false);
    };

    if (!customer) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div>
            <h1 className="page-title">Mi Perfil</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Profile Information */}
                <div>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h2>Información Personal</h2>
                            {!editing ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setEditing(true)}
                                    style={{ padding: '8px 15px', fontSize: '0.9rem' }}
                                >
                                    <FaEdit style={{ marginRight: '8px' }} />
                                    Editar
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSave}
                                        disabled={loading}
                                        style={{ padding: '8px 15px', fontSize: '0.9rem' }}
                                    >
                                        <FaSave style={{ marginRight: '8px' }} />
                                        {loading ? 'Guardando...' : 'Guardar'}
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleCancel}
                                        style={{ padding: '8px 15px', fontSize: '0.9rem' }}
                                    >
                                        <FaTimes style={{ marginRight: '8px' }} />
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>

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
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    style={{ paddingLeft: '45px' }}
                                />
                            </div>
                        </div>

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
                                    value={customer.email}
                                    disabled
                                    style={{ paddingLeft: '45px', background: '#f8f9ff' }}
                                />
                            </div>
                            <small style={{ color: '#8a8a9a', fontSize: '0.8rem' }}>
                                El email no se puede cambiar por seguridad
                            </small>
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
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    style={{ paddingLeft: '45px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Dirección</label>
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
                                    value={profileData.address}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    style={{ paddingLeft: '45px' }}
                                    placeholder="Tu dirección (opcional)"
                                />
                            </div>
                        </div>

                        <div style={{
                            background: '#f0f8f5',
                            padding: '15px',
                            borderRadius: '12px',
                            marginTop: '20px',
                            fontSize: '0.9rem',
                            color: '#5a5a7a'
                        }}>
                            <strong>Miembro desde:</strong> {new Date(customer.created_at).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div>
                    <div className="card">
                        <h2 style={{ marginBottom: '25px' }}>Acciones de Cuenta</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/my-orders')}
                                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                            >
                                📋 Ver Mis Pedidos
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/products')}
                                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                            >
                                🛍️ Ir a Comprar
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/cart')}
                                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                            >
                                🛒 Ver Carrito
                            </button>
                        </div>

                        <div style={{
                            marginTop: '30px',
                            padding: '20px',
                            background: '#fff3e0',
                            borderRadius: '12px',
                            border: '1px solid #ffcc80'
                        }}>
                            <h4 style={{ marginBottom: '15px', color: '#e65100' }}>
                                💡 Consejos de Seguridad
                            </h4>
                            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '0.9rem', color: '#e65100' }}>
                                <li>Nunca compartas tu contraseña</li>
                                <li>Cierra sesión en dispositivos públicos</li>
                                <li>Mantén tu información de contacto actualizada</li>
                                <li>Revisa regularmente tus pedidos</li>
                            </ul>
                        </div>

                        <div style={{
                            marginTop: '20px',
                            padding: '20px',
                            background: '#f8f9ff',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            color: '#5a5a7a'
                        }}>
                            <h4 style={{ marginBottom: '15px', color: '#5a5a7a' }}>
                                🎁 Beneficios de tu Cuenta
                            </h4>
                            <ul style={{ margin: '0', paddingLeft: '20px' }}>
                                <li>Historial completo de compras</li>
                                <li>Proceso de pedido más rápido</li>
                                <li>Notificaciones de estado</li>
                                <li>Acceso a ofertas exclusivas</li>
                                <li>Información de contacto guardada</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile; 