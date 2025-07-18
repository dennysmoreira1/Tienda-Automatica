import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if customer is logged in on mount
        const token = localStorage.getItem('customerToken');
        const savedCustomer = localStorage.getItem('customerData');

        if (token && savedCustomer) {
            setCustomer(JSON.parse(savedCustomer));
        }
        setLoading(false);
    }, []);

    const login = (customerData, token) => {
        setCustomer(customerData);
        localStorage.setItem('customerToken', token);
        localStorage.setItem('customerData', JSON.stringify(customerData));
    };

    const register = (customerData, token) => {
        setCustomer(customerData);
        localStorage.setItem('customerToken', token);
        localStorage.setItem('customerData', JSON.stringify(customerData));
    };

    const logout = () => {
        setCustomer(null);
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerData');
    };

    const updateProfile = (updatedData) => {
        const newCustomerData = { ...customer, ...updatedData };
        setCustomer(newCustomerData);
        localStorage.setItem('customerData', JSON.stringify(newCustomerData));
    };

    const isAuthenticated = () => {
        return customer !== null;
    };

    const getToken = () => {
        return localStorage.getItem('customerToken');
    };

    const value = {
        customer,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated,
        getToken
    };

    return (
        <CustomerAuthContext.Provider value={value}>
            {children}
        </CustomerAuthContext.Provider>
    );
};

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (!context) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    }
    return context;
}; 