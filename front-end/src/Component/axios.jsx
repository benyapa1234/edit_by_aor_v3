// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000'
});

// เพิ่ม JWT token ในทุกคำขอ
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// จัดการการหมดอายุของ token
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token หมดอายุหรือไม่ถูกต้อง ให้ logout
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_profile');
            window.location.href = '/'; // Redirect ไปยังหน้า login
        }
        return Promise.reject(error);
    }
);



export default instance;