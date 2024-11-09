import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';

export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest)
            .catch(error => {
                console.error("Помилка входу:", error);
                alert("Помилка при вході. Будь ласка, спробуйте ще раз.");
            });
    };

    return (
        <button 
            onClick={handleLogin}
            style={{
                backgroundColor: '#0078d4',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#106ebe'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#0078d4'}
        >
            Увійти через Microsoft
        </button>
    );
};