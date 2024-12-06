import axios from "axios";
import { BASE_URL } from "./constant";

export const axoinsInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

axoinsInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error); // Log the error
        return Promise.reject(error);
    }
);
