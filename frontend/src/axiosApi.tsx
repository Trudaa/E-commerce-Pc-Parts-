import axios from "axios";



const axiosApi = axios.create({
    baseURL: 'http://localhost:8000/api',
    })

    axiosApi.interceptors.request.use((request) => {
        return request
    })
    
    axiosApi.interceptors.response.use((response) => {
        return response
    }, (error) => {
        throw error
    })
      
    
    export default axiosApi