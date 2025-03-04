import axios from "axios";

const BASE_URL = "http://localhost:3000"; // Adjust the base URL if needed

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosInstance;
