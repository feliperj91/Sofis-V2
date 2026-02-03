import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.get('/whoami.php'); // Assuming a simplified endpoint or using auth.php?action=check
            if (response.data && response.data.id) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.post('/auth.php', { username, password });
        if (response.data.success) {
            // Re-fetch user or set from response
            await checkAuth();
            return true;
        }
        return false;
    };

    const logout = async () => {
        await api.post('/auth.php', { action: 'logout' }); // Adjust payload as per PHP implementation
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
