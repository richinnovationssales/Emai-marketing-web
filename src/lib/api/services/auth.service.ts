import apiClient from "../client";
import { AdminLoginDTO, AuthResponse } from "@/types/entities/admin.types";
import { UserLoginDTO, UserAuthResponse } from "@/types/entities/user.types";
import { CreateClientDTO } from "@/types/entities/client.types";
import { ApiResponse } from "@/types/api/response.types";
import { API_ENDPOINTS } from "../endpoints";

const TOKEN_COOKIE = "auth-token";
const ROLE_COOKIE = "user-role";
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const authService = {
  // Admin login
  // async loginAdmin(credentials: AdminLoginDTO): Promise<AuthResponse> {

  //     const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
  //         '/auth/login/admin',
  //         credentials
  //     );

  //     const { accessToken, user } = data.data;

  //     // Set cookies
  //     Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
  //     Cookies.set(ROLE_COOKIE, user.role, COOKIE_OPTIONS);

  //     // Also store in localStorage for Redux hydration
  //     if (typeof window !== 'undefined') {
  //         localStorage.setItem('auth-token', token);
  //         localStorage.setItem('auth-user', JSON.stringify(user));
  //     }

  //     console.log('✅ Login successful - Cookies set:', {
  //         token: Cookies.get(TOKEN_COOKIE),
  //         role: Cookies.get(ROLE_COOKIE)
  //     });

  //     return data.data;
  // },
  async loginAdmin(credentials: AdminLoginDTO): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login/admin",
      credentials
    );

    const { accessToken, refreshToken, admin } = data.data;

    // Set cookies
    Cookies.set(TOKEN_COOKIE, accessToken, COOKIE_OPTIONS);
    Cookies.set(ROLE_COOKIE, admin.role, COOKIE_OPTIONS);

    // Store for Redux hydration
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", accessToken);
      localStorage.setItem("auth-user", JSON.stringify(admin));
    }

    console.log("✅ Admin login successful:", {
      token: !!accessToken,
      role: admin.role,
    });

    return data.data;
  },

  // Client user login
  async loginUser(credentials: UserLoginDTO): Promise<UserAuthResponse> {
    const { data } = await apiClient.post<ApiResponse<UserAuthResponse>>(
      "/auth/login",
      credentials
    );

    const { accessToken, refreshToken, user } = data.data;

    // Set cookies
    Cookies.set(TOKEN_COOKIE, accessToken, COOKIE_OPTIONS);
    Cookies.set(ROLE_COOKIE, user.role, COOKIE_OPTIONS);

    // Also store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", accessToken);
      localStorage.setItem("auth-user", JSON.stringify(user));
    }

    console.log("✅ User login successful:", {
      token: !!accessToken,
      role: user.role,
    });
    return data.data;
  },

  // Client registration
  async registerClient(
    clientData: CreateClientDTO
  ): Promise<{ clientId: string; message: string }> {
    const { data } = await apiClient.post<
      ApiResponse<{ clientId: string; message: string }>
    >(API_ENDPOINTS.AUTH.REGISTER, clientData);
    return data.data;
  },

  // Logout - CRITICAL: Must clear everything
  logout(): void {
    console.log("🚪 Logging out - Clearing cookies and storage");

    // Remove cookies with explicit options
    Cookies.remove(TOKEN_COOKIE, { path: "/", domain: undefined });
    Cookies.remove(ROLE_COOKIE, { path: "/", domain: undefined });

    // Double-check removal (fallback)
    if (typeof document !== "undefined") {
      document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${ROLE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // Remove from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-user");
    }

    console.log("✅ Logout complete - Cookies after clear:", {
      token: Cookies.get(TOKEN_COOKIE),
      role: Cookies.get(ROLE_COOKIE),
    });
  },

  // Helper: Get auth token
  getToken(): string | undefined {
    return Cookies.get(TOKEN_COOKIE);
  },

  // Helper: Get user role
  getRole(): string | undefined {
    return Cookies.get(ROLE_COOKIE);
  },

  // Helper: Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

// ============================================
// FILE 2: auth.slice.ts - WITH BETTER INITIAL STATE
// ============================================
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { User } from "@/types/entities/user.types";
import { Admin } from "@/types/entities/admin.types";

interface AuthState {
  user: User | Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initialize state - READ FROM COOKIES FIRST
const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }

  // CRITICAL: Read from cookies, not localStorage
  const token = Cookies.get("auth-token");
  const userStr = localStorage.getItem("auth-user");

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log("🔄 Hydrating auth from cookies:", {
        token: !!token,
        role: user.role,
      });
      return {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      console.error("❌ Failed to parse stored user data:", error);
      // Clean up corrupted data
      localStorage.removeItem("auth-user");
      Cookies.remove("auth-token");
      Cookies.remove("user-role");
    }
  }

  console.log("⚪ No auth data found in cookies");
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | Admin; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Store user in localStorage (cookies already set in auth.service)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-user", JSON.stringify(action.payload.user));
        localStorage.setItem("auth-token", action.payload.token);
      }

      console.log("✅ Credentials set in Redux:", {
        role: action.payload.user.role,
      });
    },

    logout: (state) => {
      console.log("🚪 Redux logout triggered");

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clean up everything
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");

        // Also clear cookies from Redux side (backup)
        Cookies.remove("auth-token", { path: "/" });
        Cookies.remove("user-role", { path: "/" });
      }

      console.log("✅ Redux state cleared");
    },

    hydrateAuth: (state) => {
      console.log("💧 Hydrating auth...");

      if (typeof window !== "undefined") {
        const token = Cookies.get("auth-token");
        const userStr = localStorage.getItem("auth-user");

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            console.log("✅ Auth hydrated successfully:", { role: user.role });
          } catch (error) {
            console.error("❌ Failed to hydrate auth:", error);
            // Clean up on error
            localStorage.removeItem("auth-token");
            localStorage.removeItem("auth-user");
            Cookies.remove("auth-token");
            Cookies.remove("user-role");
          }
        } else {
          console.log("⚪ No auth data to hydrate");
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
        if (typeof window !== "undefined") {
          localStorage.setItem("auth-user", JSON.stringify(state.user));
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
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role;

// import apiClient from '../client';
// import {  AdminLoginDTO, AuthResponse } from '@/types/entities/admin.types';
// import { UserLoginDTO, UserAuthResponse } from '@/types/entities/user.types';
// import { CreateClientDTO } from '@/types/entities/client.types';
// import { ApiResponse } from '@/types/api/response.types';
// import { API_ENDPOINTS } from '../endpoints';
// import { VerifyResponse, RefreshResponse } from '@/types/auth/auth.types';
// import Cookies from 'js-cookie';

// const TOKEN_COOKIE = 'auth-token';
// const ROLE_COOKIE = 'user-role';
// const REFRESH_TOKEN_COOKIE = 'refresh-token';
// const COOKIE_OPTIONS: Cookies.CookieAttributes = {
//     expires: 7, // 7 days
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
// };

// export const authService = {
//     // Admin login
//     async loginAdmin(credentials: AdminLoginDTO): Promise<AuthResponse> {
//         const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
//             '/auth/login/admin', 
//             credentials
//         );
        
//         const { token, user, refreshToken } = data.data;
        
//         // Set cookies
//         Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
//         Cookies.set(ROLE_COOKIE, user.role, COOKIE_OPTIONS);
//         if (refreshToken) {
//             Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);
//         }
        
//         // Also store in localStorage for Redux hydration
//         if (typeof window !== 'undefined') {
//             localStorage.setItem('auth-token', token);
//             localStorage.setItem('auth-user', JSON.stringify(user));
//             if (refreshToken) {
//                 localStorage.setItem('refresh-token', refreshToken);
//             }
//         }
        
//         console.log('✅ Login successful - Cookies set:', {
//             token: Cookies.get(TOKEN_COOKIE),
//             role: Cookies.get(ROLE_COOKIE),
//             refreshToken: !!Cookies.get(REFRESH_TOKEN_COOKIE)
//         });
        
//         return data.data;
//     },

//     // Client user login
//     async loginUser(credentials: UserLoginDTO): Promise<UserAuthResponse> {

//         const { data } = await apiClient.post<ApiResponse<UserAuthResponse>>(
//             '/auth/login', 
//             credentials
//         );
        
//         const { token, user, refreshToken } = data.data;
        
//         // Set cookies
//         Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
//         Cookies.set(ROLE_COOKIE, user.role, COOKIE_OPTIONS);
//         if (refreshToken) {
//             Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);
//         }
        
//         // Also store in localStorage
//         if (typeof window !== 'undefined') {
//             localStorage.setItem('auth-token', token);
//             localStorage.setItem('auth-user', JSON.stringify(user));
//             if (refreshToken) {
//                 localStorage.setItem('refresh-token', refreshToken);
//             }
//         }
        
//         console.log('✅ Login successful - Cookies set:', {
//             token: Cookies.get(TOKEN_COOKIE),
//             role: Cookies.get(ROLE_COOKIE),
//             refreshToken: !!Cookies.get(REFRESH_TOKEN_COOKIE)
//         });
        
//         return data.data;
//     },

//     // Client registration
//     async registerClient(clientData: CreateClientDTO): Promise<{ clientId: string; message: string }> {
//         const { data } = await apiClient.post<ApiResponse<{ clientId: string; message: string }>>(
//             API_ENDPOINTS.AUTH.REGISTER,
//             clientData
//         );
//         return data.data;
//     },

//     // Logout - CRITICAL: Must clear everything
//     async logout(): Promise<void> {
//         console.log('🚪 Logging out - Clearing cookies and storage');
        
//         // Call logout API to revoke refresh token
//         try {
//             const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
//             if (refreshToken) {
//                 await apiClient.post('/auth/logout', { refreshToken });
//             }
//         } catch (error) {
//             console.error('❌ Logout API call failed:', error);
//             // Continue with local cleanup even if API call fails
//         }
        
//         // Remove cookies with explicit options
//         Cookies.remove(TOKEN_COOKIE, { path: '/', domain: undefined });
//         Cookies.remove(ROLE_COOKIE, { path: '/', domain: undefined });
//         Cookies.remove(REFRESH_TOKEN_COOKIE, { path: '/', domain: undefined });
        
//         // Double-check removal (fallback)
//         if (typeof document !== 'undefined') {
//             document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//             document.cookie = `${ROLE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//             document.cookie = `${REFRESH_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//         }
        
//         // Remove from localStorage
//         if (typeof window !== 'undefined') {
//             localStorage.removeItem('auth-token');
//             localStorage.removeItem('auth-user');
//             localStorage.removeItem('refresh-token');
//         }
        
//         console.log('✅ Logout complete - Cookies after clear:', {
//             token: Cookies.get(TOKEN_COOKIE),
//             role: Cookies.get(ROLE_COOKIE),
//             refreshToken: Cookies.get(REFRESH_TOKEN_COOKIE)
//         });
//     },

//     // Verify current access token with backend
//     async verifyToken(): Promise<VerifyResponse> {
//         const token = this.getToken();
//         if (!token) {
//             throw new Error('No token found');
//         }
        
//         const { data } = await apiClient.get<VerifyResponse>('/auth/verify');
//         return data;
//     },

//     // Refresh access token using refresh token
//     async refreshAccessToken(): Promise<string> {
//         const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE) || localStorage.getItem('refresh-token');
        
//         if (!refreshToken) {
//             throw new Error('No refresh token found');
//         }
        
//         const { data } = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken });
//         const newAccessToken = data.data.accessToken;
        
//         // Update access token in cookies and localStorage
//         Cookies.set(TOKEN_COOKIE, newAccessToken, COOKIE_OPTIONS);
//         if (typeof window !== 'undefined') {
//             localStorage.setItem('auth-token', newAccessToken);
//         }
        
//         console.log('✅ Access token refreshed successfully');
//         return newAccessToken;
//     },

//     // Helper: Get auth token
//     getToken(): string | undefined {
//         return Cookies.get(TOKEN_COOKIE);
//     },

//     // Helper: Get user role
//     getRole(): string | undefined {
//         return Cookies.get(ROLE_COOKIE);
//     },

//     // Helper: Check if authenticated
//     isAuthenticated(): boolean {
//         return !!this.getToken();
//     }
// };
