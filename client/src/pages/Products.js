import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const { addToCart } = useCart();

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

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`${product.name} agregado al carrito`);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    return (
        <div>
            <h1 className="page-title">Nuestros Productos</h1>

            {/* Search and Filter */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label htmlFor="search">
                            <FaSearch style={{ marginRight: '8px' }} />
                            Buscar productos
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="form-control"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">
                            <FaFilter style={{ marginRight: '8px' }} />
                            Filtrar por categoría
                        </label>
                        <select
                            id="category"
                            className="form-control"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {(searchTerm || selectedCategory) && (
                    <div style={{
                        marginTop: '15px',
                        padding: '10px 15px',
                        background: '#f0f8f5',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#2d5a4a'
                    }}>
                        <strong>Filtros aplicados:</strong>
                        {searchTerm && <span style={{ marginLeft: '10px' }}>Búsqueda: "{searchTerm}"</span>}
                        {selectedCategory && <span style={{ marginLeft: '10px' }}>Categoría: {selectedCategory}</span>}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('');
                            }}
                            style={{
                                marginLeft: '15px',
                                background: 'none',
                                border: 'none',
                                color: '#7fd3b6',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                    <h2 style={{ marginBottom: '15px' }}>No se encontraron productos</h2>
                    <p style={{ color: '#8a8a9a', marginBottom: '30px' }}>
                        {searchTerm || selectedCategory
                            ? 'Intenta con otros términos de búsqueda o categorías'
                            : 'No hay productos disponibles en este momento'
                        }
                    </p>
                    {(searchTerm || selectedCategory) && (
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('');
                            }}
                        >
                            Ver todos los productos
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                            }}>

                            {/* Product Image */}
                            <div style={{
                                height: '200px',
                                background: '#f8f9ff',
                                borderRadius: '12px',
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {product.image ? (
                                    <img
                                        src={`http://localhost:5000${product.image}`}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            if (e.target.nextSibling) {
                                                e.target.nextSibling.style.display = 'flex';
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
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

                            {/* Product Info */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{
                                    marginBottom: '8px',
                                    fontSize: '1.1rem',
                                    color: '#2d5a4a'
                                }}>
                                    {product.name}
                                </h3>

                                {product.description && (
                                    <p style={{
                                        color: '#8a8a9a',
                                        marginBottom: '15px',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.4',
                                        flex: 1
                                    }}>
                                        {product.description.length > 80
                                            ? `${product.description.substring(0, 80)}...`
                                            : product.description
                                        }
                                    </p>
                                )}

                                {/* Category Badge */}
                                {product.category && (
                                    <div style={{
                                        background: '#f0f8f5',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        marginBottom: '15px',
                                        fontSize: '0.8rem',
                                        color: '#2d5a4a',
                                        alignSelf: 'flex-start'
                                    }}>
                                        {product.category}
                                    </div>
                                )}

                                {/* Price and Stock */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: '#7fd3b6',
                                        fontSize: '1.2rem'
                                    }}>
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
                                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                                    </span>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock <= 0}
                                    style={{
                                        width: '100%',
                                        opacity: product.stock <= 0 ? 0.6 : 1
                                    }}
                                >
                                    <FaShoppingCart style={{ marginRight: '8px' }} />
                                    {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results Summary */}
            {filteredProducts.length > 0 && (
                <div style={{
                    marginTop: '30px',
                    padding: '15px',
                    background: '#f0f8f5',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: '#2d5a4a'
                }}>
                    <strong>
                        Mostrando {filteredProducts.length} de {products.length} productos
                        {searchTerm && ` para "${searchTerm}"`}
                        {selectedCategory && ` en categoría "${selectedCategory}"`}
                    </strong>
                </div>
            )}
        </div>
    );
};

export default Products; 