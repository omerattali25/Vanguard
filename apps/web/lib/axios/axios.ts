import axiosInstance from 'axios';

export const axios = axiosInstance.create({
    baseURL: process.env.VITE_API_GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})