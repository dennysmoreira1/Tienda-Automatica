import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { API_URL } from './config';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </BrowserRouter>
    </React.StrictMode>
); 