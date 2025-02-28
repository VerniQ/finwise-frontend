import axios from "axios";

const API_URL = "http://localhost:8080";

export const authService = {
    async login(email: string, password: string) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });

            const { token } = response.data;
            localStorage.setItem("token", token); // Zapisz token
            localStorage.setItem("isLoggedIn", "true");

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error || "Login failed. Please try again.");
            }
            throw new Error("Login failed. Please try again.");
        }
    },

    async register(name: string, email: string, password: string) {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                name,
                email,
                password
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error || "Registration failed. Please try again." + error);
            }
            throw new Error("Registration failed. Please try again.");
        }
    },

    async getUserProfile() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User is not authenticated");

            const response = await axios.get(`${API_URL}/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch user data" + error);
        }
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
    },

    isLoggedIn() {
        return localStorage.getItem("isLoggedIn") === "true";
    }
};

export default authService;

