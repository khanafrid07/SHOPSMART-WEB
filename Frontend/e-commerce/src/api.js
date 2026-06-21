import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
            originalRequest._retry = true;
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {}, { withCredentials: true });


                return api(originalRequest);
            } catch (refreshError) {

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;