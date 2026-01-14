"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import {
  setCredentials,
  setLoading,
  logout as logoutAction,
} from "@/store/slices/auth.slice";
import { authService } from "@/lib/api/services/auth.service";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();

      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      try {
        // Verify token with backend
        const verifyResponse = await authService.verifyToken();
        const userData = verifyResponse.data;

        // Set credentials in Redux
        dispatch(
          setCredentials({
            user: {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              isActive: true,
              createdAt: userData.createdAt,
              updatedAt: userData.createdAt,
              ...(userData.clientId && { clientId: userData.clientId }),
            } as any,
            token,
          })
        );

        console.log("✅ Token verified successfully");
      } catch (error: any) {
        console.error("❌ Token verification failed:", error);

        // If verification fails with 401, try to refresh
        if (error?.response?.status === 401) {
          try {
            console.log("🔄 Attempting to refresh token...");
            const newAccessToken = await authService.refreshAccessToken();

            // Retry verification with new token
            const verifyResponse = await authService.verifyToken();
            const userData = verifyResponse.data;

            dispatch(
              setCredentials({
                user: {
                  id: userData.id,
                  email: userData.email,
                  role: userData.role,
                  isActive: true,
                  createdAt: userData.createdAt,
                  updatedAt: userData.createdAt,
                  ...(userData.clientId && { clientId: userData.clientId }),
                } as any,
                token: newAccessToken,
              })
            );

            console.log("✅ Token refreshed and verified successfully");
          } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError);
            // Clear everything and logout
            await authService.logout();
            dispatch(logoutAction());
            router.push("/login");
          }
        } else {
          // Non-401 error, clear tokens
          await authService.logout();
          dispatch(logoutAction());
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch, router]);

  return <>{children}</>;
}
