import React from 'react';
import { useMsal } from '@azure/msal-react';

export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutPopup().catch(error => {
            console.error("Помилка виходу:", error);
        });
    };

    return (
        <button 
            onClick={handleLogout}
            style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '10px'
            }}
        >
            Вийти
        </button>
    );
};