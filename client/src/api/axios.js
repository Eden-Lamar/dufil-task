import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL // Adjust the base URL if needed

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosInstance;
