import axios from "axios";
import { getToken } from "./auth"; // Import getToken from your service file

const API = axios.create({
    baseURL: "http://localhost:5000/api", // <-- CORRECTED TO PORT 5000
});

// Interceptor to automatically attach the JWT token to every request
API.interceptors.request.use((config) => {
    const token = getToken(); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;