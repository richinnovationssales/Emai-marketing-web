export interface AuthState { isAuthenticated: boolean; user: any; }

// Token verification response from GET /auth/verify
export interface VerifyResponse {
  success: true;
  data: {
    id: string;
    email: string;
    role: string;
    clientId?: string;
    type: 'user' | 'admin';
    createdAt: string;
    client?: {
      id: string;
      name: string;
      isApproved: boolean;
      isActive: boolean;
    };
  };
}

// Refresh token response from POST /auth/refresh
export interface RefreshResponse {
  success: true;
  data: {
    accessToken: string;
  };
}

// Login response with both access and refresh tokens
export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user?: {
      id: string;
      email: string;
      role: string;
      clientId: string;
    };
    admin?: {
      id: string;
      email: string;
      role: string;
    };
  };
}
