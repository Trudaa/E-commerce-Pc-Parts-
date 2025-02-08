import axios from "axios";

const axiosApi = axios.create({
    baseURL: 'http://localhost:8000/api',
    })
    axiosApi.interceptors.request.use((request) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
        }
        return request
    })
    axiosApi.interceptors.response.use((response) => {
        return response
    }, (error) => {
        throw error
    })
    export default axiosApi