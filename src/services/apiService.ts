import axios from "axios";

const API_URL = "http://localhost:8080";

export const apiService = {
    async getCategories() {
        try {
            const response = await axios.get(`${API_URL}/categories`, {
                auth: {
                    username: "user", // <- Podaj poprawne dane użytkownika
                    password: "b54adb10-7876-44ba-932f-4a93e5bdeb34",
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
