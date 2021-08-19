import axios from 'axios';

export const HTTP = axios.create({
    baseURL: 'http://localhost:3000',//'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});