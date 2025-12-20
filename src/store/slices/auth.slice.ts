import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/entities/user.types';
import { Admin } from '@/types/entities/admin.types';

interface AuthState {
    user: User | Admin | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User | Admin; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            if (typeof window !== 'undefined') {
                localStorage.setItem('auth-token', action.payload.token);
                localStorage.setItem('auth-user', JSON.stringify(action.payload.user));
                document.cookie = `auth-token=${action.payload.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-token');
                localStorage.removeItem('auth-user');
                document.cookie = 'auth-token=; path=/; max-age=0';
            }
        },
        hydrateAuth: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('auth-token');
                const userStr = localStorage.getItem('auth-user');

                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        state.user = user;
                        state.token = token;
                        state.isAuthenticated = true;
                    } catch (error) {
                        console.error('Failed to parse stored user data:', error);
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('auth-user');
                    }
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

export const { setCredentials, logout, hydrateAuth, setLoading, setError, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
