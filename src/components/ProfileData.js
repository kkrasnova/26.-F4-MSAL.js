import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, graphConfig } from '../config/authConfig';

export const ProfileData = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const styles = {
        container: {
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            margin: '20px auto',
            maxWidth: '600px'
        },
        field: {
            marginBottom: '15px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center'
        },
        label: {
            fontWeight: 'bold',
            color: '#495057',
            marginRight: '12px',
            display: 'inline-block',
            minWidth: '120px'
        },
        value: {
            color: '#212529',
            flex: 1
        },
        refreshButton: {
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '25px',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'block',
            width: '100%'
        },
        title: {
            color: '#212529',
            marginBottom: '25px',
            fontSize: '24px',
            textAlign: 'center'
        },
        error: {
            color: '#dc3545',
            padding: '15px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '1px solid #f5c6cb',
            textAlign: 'center'
        },
        loading: {
            color: '#666',
            padding: '20px',
            textAlign: 'center',
            fontSize: '16px'
        }
    };

    const getLanguageName = (langCode) => {
        const languages = {
            'uk-UA': 'Українська',
            'ru-RU': 'Російська',
            'en-US': 'Англійська (США)',
            'en-GB': 'Англійська (Великобританія)'
        };
        return languages[langCode] || langCode;
    };

    const formatValue = (value) => {
        if (!value) return '-';
        return value.toString().trim();
    };

    const callMsGraph = async (accessToken) => {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${accessToken}`);

        const options = {
            method: "GET",
            headers: headers
        };

        try {
            setLoading(true);
            const response = await fetch(graphConfig.graphMeEndpoint, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setGraphData(data);
            setError(null);
        } catch (error) {
            setError(`Помилка отримання даних: ${error.message}`);
            console.error("Graph API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (accounts[0]) {
            try {
                setIsUpdating(true);
                const response = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0]
                });
                await callMsGraph(response.accessToken);
            } catch (error) {
                setError(`Помилка оновлення даних: ${error.message}`);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    useEffect(() => {
        if (accounts[0]) {
            instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            })
            .then((response) => {
                callMsGraph(response.accessToken);
            })
            .catch((error) => {
                setError(`Помилка отримання токену: ${error.message}`);
                console.error("Token Error:", error);
            });
        }
    }, [accounts]);

    if (loading) {
        return <div style={styles.loading}>Завантаження даних профілю...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <button 
                onClick={refreshProfile} 
                style={{
                    ...styles.refreshButton,
                    opacity: isUpdating ? 0.7 : 1,
                    cursor: isUpdating ? 'wait' : 'pointer'
                }}
                disabled={isUpdating}
            >
                {isUpdating ? 'Оновлення...' : 'Оновити дані профілю'}
            </button>

            {graphData && (
                <>
                    <h2 style={styles.title}>Дані профілю</h2>
                    <div style={styles.field}>
                        <span style={styles.label}>Повне ім'я:</span>
                        <span style={styles.value}>{formatValue(graphData.displayName)}</span>
                    </div>
                    <div style={styles.field}>
                        <span style={styles.label}>Email:</span>
                        <span style={styles.value}>{formatValue(graphData.userPrincipalName)}</span>
                    </div>
                    <div style={styles.field}>
                        <span style={styles.label}>ID:</span>
                        <span style={styles.value}>{formatValue(graphData.id)}</span>
                    </div>
                    {graphData.givenName && (
                        <div style={styles.field}>
                            <span style={styles.label}>Ім'я:</span>
                            <span style={styles.value}>{formatValue(graphData.givenName)}</span>
                        </div>
                    )}
                    {graphData.surname && (
                        <div style={styles.field}>
                            <span style={styles.label}>Прізвище:</span>
                            <span style={styles.value}>{formatValue(graphData.surname)}</span>
                        </div>
                    )}
                    {graphData.preferredLanguage && (
                        <div style={styles.field}>
                            <span style={styles.label}>Бажана мова:</span>
                            <span style={styles.value}>{getLanguageName(graphData.preferredLanguage)}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};