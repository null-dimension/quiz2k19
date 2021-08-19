import axios from 'axios';

export const HTTP = axios.create({
    baseURL: process.env.BASE_URL || 'http://localhost:3000',//'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});