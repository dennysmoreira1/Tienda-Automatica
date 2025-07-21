// Backend API URL configuration
export const API_URL = process.env.REACT_APP_API_URL || 'https://tienda-backend-80i5.onrender.com';

// Image URL configuration
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    return `${API_URL}${imagePath}`;
}; 