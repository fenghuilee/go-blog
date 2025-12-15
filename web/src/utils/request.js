import axios from 'axios';

// 从环境变量获取 API base URL，如果没有设置则使用默认值 '/api'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const request = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        const { code, message, data } = response.data;
        if (code !== 0) {
            console.error(`API Error: ${message}`);
            return Promise.reject(new Error(message));
        }
        return data;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default request;
