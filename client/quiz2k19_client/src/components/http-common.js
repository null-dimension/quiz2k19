import axios from 'axios';

export const HTTP = axios.create({
    baseURL: 'https://whispering-anchorage-66988.herokuapp.com',//'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});