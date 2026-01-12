import axios, {
	AxiosError,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem("accessToken");

		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);
axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshResponse = await axios.post(
					`${API_BASE_URL}/auth/refresh`,
					{},
					{ withCredentials: true }
				);

				const newAccessToken = refreshResponse.data.accessToken;

				if (newAccessToken) {
					localStorage.setItem("accessToken", newAccessToken);

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					}

					return axiosInstance(originalRequest);
				}
			} catch (refreshError) {
				localStorage.removeItem("accessToken");
				localStorage.removeItem("user");
				window.location.href = "/auth";
				return Promise.reject(refreshError);
			}
		}

		if (error.response?.status === 403) {
			console.error("Access forbidden - insufficient permissions");
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
