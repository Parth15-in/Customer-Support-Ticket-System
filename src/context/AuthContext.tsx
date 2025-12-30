'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';


import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string | null;
    role: 'CUSTOMER' | 'AGENT';
}

interface AuthContextType {
    user: User | null;
    login: (userData: any, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to restore user session:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', token);
        router.push('/dashboard');
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            router.push('/login');
        }
    };

    const value = React.useMemo(() => ({
        user,
        login,
        logout,
        isLoading
    }), [user, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
