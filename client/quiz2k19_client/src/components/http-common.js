import axios from 'axios';

export const HTTP = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL ,//'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});