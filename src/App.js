import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { SignInButton } from './components/SignInButton';
import { SignOutButton } from './components/SignOutButton';
import { ProfileData } from './components/ProfileData';

function App() {
    const { accounts } = useMsal();

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
        },
        title: {
            color: '#333',
            margin: 0
        },
        userInfo: {
            backgroundColor: '#e9ecef',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
        },
        welcomeContainer: {
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginTop: '20px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>F4 MSAL.js Демо</h1>
                <AuthenticatedTemplate>
                    <SignOutButton />
                </AuthenticatedTemplate>
            </div>

            <AuthenticatedTemplate>
                <div style={styles.userInfo}>
                    <p>Ви увійшли як: <strong>{accounts[0]?.username}</strong></p>
                </div>
                <ProfileData />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <div style={styles.welcomeContainer}>
                    <h2>Ласкаво просимо!</h2>
                    <p>Будь ласка, увійдіть для доступу до даних</p>
                    <SignInButton />
                </div>
            </UnauthenticatedTemplate>
        </div>
    );
}

export default App;