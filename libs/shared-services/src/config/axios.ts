import axios from "axios";

const axiosInstance = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? process.env["DEV_BASE_API"]
            : process.env["NEXT_PUBLIC_API_URL"] || "",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window === "undefined") {
            config.headers["X-Requested-With"] = "XMLHttpRequest";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Axios Error:", error);
        return Promise.reject(error);
    }
);

export { axiosInstance };
