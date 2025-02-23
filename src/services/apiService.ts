import axios from "axios";

const API_URL = "http://localhost:8080";

export const apiService = {
    async getCategories() {
        try {
            const response = await axios.get(`${API_URL}/categories`, {
                auth: {
                    username: "user", // <- Podaj poprawne dane użytkownika
                    password: "06f84cf2-cf3c-4063-836e-6fd1821a7eb1",
                },
            });
            console.log("API Response:", response.data);
            return response.data || [];
        } catch (error) {
            console.error("Error fetching categories", error);
            return [];
        }
    },
};
