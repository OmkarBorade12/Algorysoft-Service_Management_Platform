import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'https://api.algorysoft.com'),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
