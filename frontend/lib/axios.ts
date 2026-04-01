import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://127.0.0.1:8000'),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
