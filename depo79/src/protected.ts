import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("authToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
