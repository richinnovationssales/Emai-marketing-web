import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://apiemailcrm.smartsolutionsme.com/api",
    // "http://localhost:4000/api",
    // "https://email-crm-app.duckdns.org/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// =====================
// REQUEST INTERCEPTOR
// =====================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth-token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================
// RESPONSE INTERCEPTOR
// =====================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// ✅ Auth endpoints should NEVER trigger a token refresh attempt.
// A 401 on /auth/login means wrong credentials — not an expired token.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/login/admin", "/auth/refresh"];

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // ✅ If this is a login/auth endpoint — just reject with the raw error.
    // The login page's catch block + getErrorMessage() will handle it correctly.
    // Without this guard, a failed login triggers a refresh attempt, which
    // fails, which wipes all storage and force-redirects to /login.
    if (isAuthEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // ⏳ If refresh already running → queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { authService } = await import("./services/auth.service");
        const newAccessToken = await authService.refreshAccessToken();

        localStorage.setItem("auth-token", newAccessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // 🚪 Force logout — only reaches here for non-auth endpoints
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("auth-user");

        document.cookie =
          "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        window.location.replace("/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// const apiClient = axios.create({
//   baseURL:
//     process.env.NEXT_PUBLIC_API_BASE_URL ||
//     "https://apiemailcrm.smartsolutionsme.com/api",
//     //     // "http://localhost:4000/api",
// //     // "https://email-crm-app.duckdns.org/api",
//   headers: { "Content-Type": "application/json" },
//   timeout: 30000,
// });

// // =====================
// // REQUEST INTERCEPTOR
// // =====================
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("auth-token")
//         : null;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // =====================
// // RESPONSE INTERCEPTOR
// // =====================
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: unknown) => void;
//   reject: (reason?: unknown) => void;
// }> = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((p) => {
//     if (error) p.reject(error);
//     else p.resolve(token);
//   });
//   failedQueue = [];
// };

// // ✅ Auth endpoints should NEVER trigger a token refresh attempt.
// // A 401 on /auth/login means wrong credentials — not an expired token.
// const AUTH_ENDPOINTS = ["/auth/login", "/auth/login/admin", "/auth/refresh"];

// const isAuthEndpoint = (url?: string): boolean => {
//   if (!url) return false;
//   return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
// };

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as
//       | (InternalAxiosRequestConfig & { _retry?: boolean })
//       | undefined;

//     // ✅ If this is a login/auth endpoint — just reject with the raw error.
//     // The login page's catch block + getErrorMessage() will handle it correctly.
//     // Without this guard, a failed login triggers a refresh attempt, which
//     // fails, which wipes all storage and force-redirects to /login.
//     if (isAuthEndpoint(originalRequest?.url)) {
//       return Promise.reject(error);
//     }

//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       // ⏳ If refresh already running → queue request
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => apiClient(originalRequest));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const { authService } = await import("./services/auth.service");
//         const newAccessToken = await authService.refreshAccessToken();

//         localStorage.setItem("auth-token", newAccessToken);
//         apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         processQueue(null, newAccessToken);
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);

//         // 🚪 Force logout — only reaches here for non-auth endpoints
//         localStorage.removeItem("auth-token");
//         localStorage.removeItem("refresh-token");
//         localStorage.removeItem("auth-user");

//         document.cookie =
//           "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         document.cookie =
//           "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         document.cookie =
//           "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

//         window.location.replace("/login");
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;



// import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// const apiClient = axios.create({
//   baseURL:
//     process.env.NEXT_PUBLIC_API_BASE_URL ||
//      "https://apiemailcrm.smartsolutionsme.com/api",
//     // "http://localhost:4000/api",
//     // "https://email-crm-app.duckdns.org/api",

//   headers: { "Content-Type": "application/json" },
//   timeout: 30000,
// });

// // =====================
// // REQUEST INTERCEPTOR
// // =====================
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("auth-token")
//         : null;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   error => Promise.reject(error)
// );

// // =====================
// // RESPONSE INTERCEPTOR
// // =====================
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: unknown) => void;
//   reject: (reason?: unknown) => void;
// }> = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach(p => {
//     if (error) p.reject(error);
//     else p.resolve(token);
//   });
//   failedQueue = [];
// };

// apiClient.interceptors.response.use(
//   response => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as
//       | (InternalAxiosRequestConfig & { _retry?: boolean })
//       | undefined;

//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       // ⏳ If refresh already running → queue request
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => apiClient(originalRequest));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const { authService } = await import("./services/auth.service");
//         const newAccessToken = await authService.refreshAccessToken();

//         // 🔑 Update global + request headers
//         localStorage.setItem("auth-token", newAccessToken);
//         apiClient.defaults.headers.common.Authorization =
//           `Bearer ${newAccessToken}`;
//         originalRequest.headers.Authorization =
//           `Bearer ${newAccessToken}`;

//         processQueue(null, newAccessToken);
//         return apiClient(originalRequest); // ✅ RETRY
//       } catch (refreshError) {
//         processQueue(refreshError, null);

//         // 🚪 Force logout
//         localStorage.removeItem("auth-token");
//         localStorage.removeItem("refresh-token");
//         localStorage.removeItem("auth-user");

//         document.cookie =
//           "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         document.cookie =
//           "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         document.cookie =
//           "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

//         window.location.replace("/login");
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;
