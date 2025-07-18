import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaUpload, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return null;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post('/api/products/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploading(false);
            return response.data.imageUrl;
        } catch (error) {
            setUploading(false);
            console.error('Error uploading image:', error);
            toast.error('Error al subir la imagen');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price) {
            toast.error('Por favor completa los campos obligatorios');
            return;
        }

        try {
            let imageUrl = formData.image;

            // Upload new image if selected
            if (imageFile) {
                imageUrl = await uploadImage();
                if (!imageUrl) return;
            }

            const productData = {
                ...formData,
                image: imageUrl,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0
            };

            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct.id}`, productData);
                toast.success('Producto actualizado exitosamente');
            } else {
                await axios.post('/api/products', productData);
                toast.success('Producto creado exitosamente');
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Error al guardar el producto');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            category: product.category || '',
            stock: product.stock.toString(),
            image: product.image || ''
        });
        setImagePreview(product.image ? `http://localhost:5000${product.image}` : '');
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await axios.delete(`/api/products/${productId}`);
                toast.success('Producto eliminado exitosamente');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Error al eliminar el producto');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            image: ''
        });
        setImageFile(null);
        setImagePreview('');
        setEditingProduct(null);
        setShowForm(false);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData({
            ...formData,
            image: ''
        });
    };

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="page-title">Gestión de Productos</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <FaPlus style={{ marginRight: '8px' }} />
                    Agregar Producto
                </button>
            </div>

            {/* Product Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '20px' }}>
                        {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <div className="form-group">
                                    <label htmlFor="name">
                                        Nombre del producto <span style={{ color: '#ff8a95' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Descripción</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="form-control"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price">
                                        Precio <span style={{ color: '#ff8a95' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        className="form-control"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category">Categoría</label>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        className="form-control"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stock">Stock</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        className="form-control"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label htmlFor="image">Imagen del producto</label>
                                    <div style={{
                                        border: '2px dashed #e0e0e0',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        {imagePreview ? (
                                            <div>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '200px',
                                                        borderRadius: '8px',
                                                        marginBottom: '10px'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={removeImage}
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    <FaTimes style={{ marginRight: '5px' }} />
                                                    Cambiar Imagen
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <FaImage style={{ fontSize: '3rem', color: '#8a8a9a', marginBottom: '10px' }} />
                                                <p style={{ color: '#8a8a9a', marginBottom: '15px' }}>
                                                    Arrastra una imagen aquí o haz clic para seleccionar
                                                </p>
                                                <input
                                                    type="file"
                                                    id="image"
                                                    name="image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    style={{ display: 'none' }}
                                                />
                                                <label htmlFor="image" className="btn btn-secondary">
                                                    <FaUpload style={{ marginRight: '8px' }} />
                                                    Seleccionar Imagen
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    <small style={{ color: '#8a8a9a' }}>
                                        Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? 'Subiendo...' : (editingProduct ? 'Actualizar' : 'Crear')}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Products List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {products.map((product) => (
                    <div key={product.id} className="card">
                        <div style={{
                            height: '200px',
                            background: '#f8f9ff',
                            borderRadius: '12px',
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {product.image ? (
                                <img
                                    src={`http://localhost:5000${product.image}`}
                                    alt={product.name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) {
                                            e.target.nextSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            {/* Fallback para imagen faltante o error */}
                            {!product.image && (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#f0f0f0',
                                    color: '#aaa',
                                    fontSize: '1.2rem'
                                }}>
                                    Sin imagen
                                </div>
                            )}
                        </div>

                        <h3 style={{ marginBottom: '10px' }}>{product.name}</h3>
                        <p style={{ color: '#8a8a9a', marginBottom: '10px', fontSize: '0.9rem' }}>
                            {product.description || 'Sin descripción'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ fontWeight: 'bold', color: '#7fd3b6', fontSize: '1.1rem' }}>
                                ${product.price.toFixed(2)}
                            </span>
                            <span style={{
                                background: product.stock > 0 ? '#e8f5e8' : '#ffebee',
                                color: product.stock > 0 ? '#2e7d32' : '#d32f2f',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}>
                                Stock: {product.stock}
                            </span>
                        </div>

                        {product.category && (
                            <div style={{
                                background: '#f0f8f5',
                                padding: '5px 10px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                fontSize: '0.8rem',
                                color: '#2d5a4a'
                            }}>
                                {product.category}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleEdit(product)}
                                style={{ flex: 1 }}
                            >
                                <FaEdit style={{ marginRight: '5px' }} />
                                Editar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(product.id)}
                                style={{ flex: 1 }}
                            >
                                <FaTrash style={{ marginRight: '5px' }} />
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
                    <h2 style={{ marginBottom: '15px' }}>No hay productos</h2>
                    <p style={{ color: '#8a8a9a', marginBottom: '30px' }}>
                        Comienza agregando tu primer producto
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus style={{ marginRight: '8px' }} />
                        Agregar Producto
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminProducts; 