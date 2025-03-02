import axios from "axios";

const API_URL = "http://localhost:8080";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found, user is not authenticated");
        throw new Error("User is not authenticated");
    }
    return { Authorization: `Bearer ${token}` };
};

const handleApiError = (error: unknown) => {
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
};

export const apiService = {
    async getCategories() {
        try {
            const response = await axios.get(`${API_URL}/categories`, {
                headers: getAuthHeaders(),
            });
            return response.data || [];
        } catch (error) {
            handleApiError(error);
        }
    },

    async getUserInfo() {
        try {
            const response = await axios.get(`${API_URL}/users/me`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async addExpense(expenseData: {
        title: string;
        token: string;
        categoryId: number;
        expenseDateTime: string;
        amount: number;
    }) {
        try {
            const response = await axios.post(`${API_URL}/expenses`, expenseData, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async getUserExpenses(userId: number) {
        try {
            const response = await axios.get(`${API_URL}/expenses/user/${userId}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // Budget Endpoints
    async getBudgets() {
        try {
            const response = await axios.get(`${API_URL}/budgets`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async getUserBudgets(userId: number) {
        try {
            const response = await axios.get(`${API_URL}/budgets/user/${userId}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async getUserBudgetsFiltered(userId: number, month?: number, year?: number) {
        try {
            const params: { month?: number; year?: number } = {};
            if (month !== undefined) params.month = month;
            if (year !== undefined) params.year = year;
            const response = await axios.get(`${API_URL}/budgets/user/${userId}/filter`, {
                headers: getAuthHeaders(),
                params,
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async addBudget(budgetData: {
        userId: number;
        totalBudgetLimit: number;
        month: number;
        year: number;
    }) {
        try {
            const response = await axios.post(`${API_URL}/budgets`, budgetData, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // Budget Category Endpoints
    async getBudgetCategories() {
        try {
            const response = await axios.get(`${API_URL}/budget-categories`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async addBudgetCategory(budgetCategoryData: {
        budgetId: number;
        categoryId: number;
        categoryBudgetLimit: number;
    }) {
        try {
            const response = await axios.post(`${API_URL}/budget-categories`, budgetCategoryData, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
};