import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://trello-board-be-production.up.railway.app', // Your backend URL
});

export default instance;