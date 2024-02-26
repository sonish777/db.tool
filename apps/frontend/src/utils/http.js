import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:
        process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1',
});

axiosInstance.defaults.headers.common.Accept = 'application/json';

axiosInstance.interceptors.request.use(function (config) {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
        config.headers.Authorization = null;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (value) => value,
    (err) => {
        if (err?.response?.data && err.response.data.error) {
            const error = err.response.data.error;
            if (error.statusCode === 401) {
                window.location.replace('/authentication/connect');
                return;
            }
        }
        throw err;
    }
);

export const getURLParams = (query) =>
    new URLSearchParams({
        ...query,
    }).toString();
