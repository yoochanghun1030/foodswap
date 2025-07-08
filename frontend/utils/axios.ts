// utils/axios.ts
import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
})
instance.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

export default instance
