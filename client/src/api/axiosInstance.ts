import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization)
      config.headers.Authorization = `Bearer ${token}`;
    return config;
  },

  async (error) => {
    return Promise.reject(error);
  },
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (originalRequest.url === "/auth/refresh") {
        window.location.href = "/signin";
        return;
      }
      try {
        const response = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newToken = response.data.data.newAccessToken;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        const res = await api(originalRequest);
        return res;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  },
);
