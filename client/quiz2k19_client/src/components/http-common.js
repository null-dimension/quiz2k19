import axios from 'axios';

export const HTTP = axios.create({
    baseURL: 'https://lan-quiz.herokuapp.com',//'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});