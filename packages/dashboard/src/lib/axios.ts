import axios  from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.VITE_API_BASE_URL,
})


