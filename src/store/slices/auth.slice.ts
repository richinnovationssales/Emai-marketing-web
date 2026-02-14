// ============================================
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { User } from '@/types/entities/user.types';
import { Admin } from '@/types/entities/admin.types';

interface AuthState {
    user: User | Admin | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Initialize state - READ FROM COOKIES FIRST
const getInitialState = (): AuthState => {
    if (typeof window === 'undefined') {
        return {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        };
    }

    // CRITICAL: Read from cookies, not localStorage
    const token = Cookies.get('auth-token');
    const userStr = localStorage.getItem('auth-user');

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            console.log('🔄 Hydrating auth from cookies:', { token: !!token, role: user.role });
            return {
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        } catch (error) {
            console.error('❌ Failed to parse stored user data:', error);
            // Clean up corrupted data
            localStorage.removeItem('auth-user');
            Cookies.remove('auth-token');
            Cookies.remove('user-role');
        }
    }

    console.log('⚪ No auth data found in cookies');
    return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User | Admin; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            // Store user in localStorage (cookies already set in auth.service)
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth-user', JSON.stringify(action.payload.user));
                localStorage.setItem('auth-token', action.payload.token);
            }
            
            console.log('✅ Credentials set in Redux:', { role: action.payload.user.role });
        },

        logout: (state) => {
            console.log('🚪 Redux logout triggered');
            
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            // Clean up everything
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-token');
                localStorage.removeItem('auth-user');
                
                // Also clear cookies from Redux side (backup)
                Cookies.remove('auth-token', { path: '/' });
                Cookies.remove('user-role', { path: '/' });
            }
            
            console.log('✅ Redux state cleared');
        },

        hydrateAuth: (state) => {
            console.log('💧 Hydrating auth...');
            
            if (typeof window !== 'undefined') {
                const token = Cookies.get('auth-token');
                const userStr = localStorage.getItem('auth-user');

                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        state.user = user;
                        state.token = token;
                        state.isAuthenticated = true;
                        console.log('✅ Auth hydrated successfully:', { role: user.role });
                    } catch (error) {
                        console.error('❌ Failed to hydrate auth:', error);
                        // Clean up on error
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('auth-user');
                        Cookies.remove('auth-token');
                        Cookies.remove('user-role');
                    }
                } else {
                    console.log('⚪ No auth data to hydrate');
                }
                
                state.isLoading = false;
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        clearError: (state) => {
            state.error = null;
        },

        updateUser: (state, action: PayloadAction<Partial<User | Admin>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload } as User | Admin;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth-user', JSON.stringify(state.user));
                }
            }
        },
    },
});

export const { 
    setCredentials, 
    logout, 
    hydrateAuth, 
    setLoading, 
    setError, 
    clearError, 
    updateUser 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

