import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  logout as logoutAction,
  setCredentials,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '@/store/slices/auth.slice';
import { authService } from '../services/auth.service';
import { AdminLoginDTO } from '@/types/entities/admin.types';
import { UserLoginDTO } from '@/types/entities/user.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  // ========================
  // ADMIN LOGIN (FIXED)
  // ========================
  const loginAdmin = useCallback(async (credentials: AdminLoginDTO) => {
    try {
      const response = await authService.loginAdmin(credentials);

      dispatch(
        setCredentials({
          user: response.admin,          // ✅ FIX
          token: response.accessToken    // ✅ FIX
        })
      );

      return response;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // ========================
  // USER LOGIN (UNCHANGED)
  // ========================
  const loginUser = useCallback(async (credentials: UserLoginDTO) => {
    try {
      const response = await authService.loginUser(credentials);

      dispatch(
        setCredentials({
          user: response.user,
          token: response.accessToken
        })
      );

      return response;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    console.log('🚪 Logout initiated from hook');

    authService.logout();
    dispatch(logoutAction());

    router.push('/login');
    router.refresh();

    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }, [dispatch, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginAdmin,
    loginUser,
    logout
  };
};


// import { useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import {
//     logout as logoutAction,
//     setCredentials,
//     selectCurrentUser,
//     selectIsAuthenticated,
//     selectAuthLoading,
//     selectAuthError
// } from '@/store/slices/auth.slice';
// import { authService } from '../services/auth.service';
// import { AdminLoginDTO } from '@/types/entities/admin.types';
// import { UserLoginDTO } from '@/types/entities/user.types';

// export const useAuth = () => {
//     const dispatch = useAppDispatch();
//     const router = useRouter();

//     const user = useAppSelector(selectCurrentUser);
//     const isAuthenticated = useAppSelector(selectIsAuthenticated);
//     const isLoading = useAppSelector(selectAuthLoading);
//     const error = useAppSelector(selectAuthError);

//     const loginAdmin = useCallback(async (credentials: AdminLoginDTO) => {
//         try {
//             const response = await authService.loginAdmin(credentials);
//             dispatch(setCredentials({ user: response.user, token: response.token }));
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }, [dispatch]);

//     const loginUser = useCallback(async (credentials: UserLoginDTO) => {
//         try {
//             const response = await authService.loginUser(credentials);
//             dispatch(setCredentials({ user: response.user, token: response.token }));
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }, [dispatch]);

//     const logout = useCallback(() => {
//         console.log('🚪 Logout initiated from hook');
        
//         // Clear service-side (cookies + localStorage)
//         authService.logout();
        
//         // Clear Redux state
//         dispatch(logoutAction());
        
//         // Force navigation and refresh to clear everything
//         router.push('/login');
//         router.refresh(); // Force middleware to re-run
        
//         // Optional: Hard reload to ensure clean state
//         setTimeout(() => {
//             window.location.href = '/login';
//         }, 100);
//     }, [dispatch, router]);

//     return {
//         user,
//         isAuthenticated,
//         isLoading,
//         error,
//         loginAdmin,
//         loginUser,
//         logout
//     };
// };
