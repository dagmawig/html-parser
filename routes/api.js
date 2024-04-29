import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config()

const api = axios.create({
    baseURL: process.env.BASE_URL,
    url: process.env.URL,
    timeout: 30000, // 30 second timeout
    params: {/*add necessary params here*/}
});

api.interceptors.request.use(config=> {
    console.warn("Request was sent");
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(response=> {
    console.warn("Response was received");

    return response;
}, error => {
    return Promise.reject(error);
});

export default api;