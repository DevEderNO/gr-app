import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gr-backend.herokuapp.com',
});

export default api;
