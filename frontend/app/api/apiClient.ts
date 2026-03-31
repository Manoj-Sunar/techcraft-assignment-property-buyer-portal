import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});





api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // ❌ STOP if refresh-token itself fails
    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.get("/api/buyer/refresh-token");

        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


// reusabel api calling 
export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const res = await api.get<T>(url);
    return res.data;
  },

  post: async <T, B>(url: string, body: B): Promise<T> => {
    const res = await api.post<T>(url, body);
    return res.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const res = await api.delete<T>(url);
    return res.data;
  },
};
