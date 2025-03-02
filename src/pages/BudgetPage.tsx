import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import BudgetForm from "../components/BudgetForm";
import BudgetList from "../components/BudgetList";
import { Plus } from "lucide-react";

interface Budget {
    id: number;
    totalBudgetLimit?: number;
    month: number;
    year: number;
    userId: number;
}

interface BudgetCategory {
    id: number;
    budgetId: number;
    categoryId: number;
    categoryBudgetLimit: number;
}

const BudgetPage: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                setLoading(true);
                const userInfo = await apiService.getUserInfo();
                setUserId(userInfo.id);

                const fetchedBudgets = await apiService.getUserBudgets(userInfo.id);
                const fetchedBudgetCategories = await apiService.getBudgetCategories();

                setBudgets(fetchedBudgets);
                setBudgetCategories(fetchedBudgetCategories);
            } catch (err) {
                console.error("Error fetching budgets:", err);
                setError("Failed to load budget data.");
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, []);

    const handleBudgetAdded = async (newBudget: Budget) => {
        setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
    };

    const handleBudgetCategoryAdded = async (newBudgetCategory: BudgetCategory) => {
        setBudgetCategories((prevCategories) => [...prevCategories, newBudgetCategory]);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">My Budgets</h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">Loading...</div>
                    ) : error ? (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
                    ) : (
                        <BudgetList budgets={budgets} budgetCategories={budgetCategories} />
                    )}
                </div>
            </div>

            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
                <Plus size={24} />
            </button>

            {isOpen && userId && (
                <BudgetForm
                    userId={userId}
                    onClose={() => setIsOpen(false)}
                    onBudgetAdded={handleBudgetAdded}
                    onBudgetCategoryAdded={handleBudgetCategoryAdded}
                />
            )}
        </div>
    );
};

export default BudgetPage;
