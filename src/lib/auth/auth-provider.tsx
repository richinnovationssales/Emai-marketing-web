'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, setLoading } from '@/store/slices/auth.slice';
import apiClient from '@/lib/api/client';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        try {
          // Verify token and get user data
          // Ideally endpoint should be /auth/me or similar
          // For now we just set the token and stop loading, heavily assuming token is valid
          // In a real app we'd fetch the user profile here
          
          // const { data } = await apiClient.get('/auth/me');
          // dispatch(setCredentials({ user: data.user, token }));
          
          // Since we don't have the /me endpoint in the plan yet, we'll just acknowledge the token
          // and let the specific pages handle data fetching or 401s
          
        } catch (error) {
          localStorage.removeItem('auth-token');
        }
      }
      dispatch(setLoading(false));
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
