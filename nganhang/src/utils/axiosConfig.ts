import axios from "axios";

const API_URL = "http://localhost:5000";

// Các request sẽ đều đc đính kèm access token
// Các response sẽ đều đc kiểm tra access token, để có cơ chế refresh token, hoặc đăng nhập lại

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor request
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

// middleware backend kiểm tra access token
// 401: Không có access token đính kèm trong header
// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refresh access token
        const res = await axios.post(
          "http://localhost:5000/api/auth/refreshAccessToken",
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        if (res.status === 200) {
          // lưu lại access token mới
          localStorage.setItem(
            "token",
            JSON.stringify({ access_token: res.data.accessToken })
          );
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.access_token}`;
          return axiosInstance(originalRequest);
        }
        else {
          // refresh token hết hạn
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error.response.data);
  }
);

export default axiosInstance;