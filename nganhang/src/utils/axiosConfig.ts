import axios from "axios";

const API_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url?.includes("/login")) {
      return config;
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token).access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${API_URL}/auth/refreshToken`,
          {},
          { withCredentials: true }
        );
        if (res.status === 200) {
          localStorage.setItem(
            "token",
            JSON.stringify({ access_token: res.data.access_token })
          );
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.access_token}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Refresh token failed:", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
