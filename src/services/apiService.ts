import axios from "axios";

const API_URL = "http://localhost:8080";

export const apiService = {
    async getCategories() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error(" No token found, user is not authenticated");
                throw new Error("User is not authenticated");
            }

            const response = await axios.get(`${API_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data || [];
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(" Axios error:", error.response?.data || error.message);
                throw new Error(error.response?.data?.message || "API request failed");
            } else if (error instanceof Error) {
                console.error(" General error:", error.message);
                throw new Error(error.message);
            } else {
                console.error(" Unknown error occurred");
                throw new Error("An unknown error occurred");
            }
        }
    },

    async getUserInfo() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found, user is not authenticated");
                throw new Error("User is not authenticated");
            }

            const response = await axios.get(`${API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
                throw new Error(error.response?.data?.message || "API request failed");
            } else if (error instanceof Error) {
                console.error("General error:", error.message);
                throw new Error(error.message);
            } else {
                console.error("Unknown error occurred");
                throw new Error("An unknown error occurred");
            }
        }
    },
};
