import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { PostContextProvider } from './context/PostContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <PostContextProvider>
            <App/>
        </PostContextProvider>
    </AuthContextProvider>
);
