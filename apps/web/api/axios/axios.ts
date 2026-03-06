import axiosInstance from 'axios';

export const axios = axiosInstance.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})