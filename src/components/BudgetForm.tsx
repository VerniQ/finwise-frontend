import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { Budget, Category, BudgetCategory } from "../types/BudgetTypes";

interface BudgetFormProps {
    userId: number;
    onClose: () => void;
    onBudgetAdded: (newBudget: Budget) => void;
    onBudgetCategoryAdded: (newBudgetCategory: BudgetCategory) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ userId, onClose, onBudgetAdded, onBudgetCategoryAdded }) => {
    const [budgetType, setBudgetType] = useState<"global" | "category">("global");
    const [totalBudgetLimit, setTotalBudgetLimit] = useState("");
    const [categoryBudgetLimit, setCategoryBudgetLimit] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await apiService.getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            console.error("User ID is undefined!");
            return;
        }

        if (budgetType === "global") {
            const budgetData = {
                userId,
                totalBudgetLimit: parseFloat(totalBudgetLimit),
                month: parseInt(month),
                year: parseInt(year),
            };

            try {
                const createdBudget = await apiService.addBudget(budgetData);
                onBudgetAdded(createdBudget);
                onClose();
            } catch (error) {
                console.error("Error adding budget:", error);
            }
        } else {
            if (!categoryId) {
                console.error("Category ID is undefined!");
                return;
            }

            const budgetCategoryData = {
                budgetId: userId,
                categoryId,
                categoryBudgetLimit: parseFloat(categoryBudgetLimit),
            };

            try {
                const createdBudgetCategory = await apiService.addBudgetCategory(budgetCategoryData);
                onBudgetCategoryAdded(createdBudgetCategory);
                onClose();
            } catch (error) {
                console.error("Error adding budget category:", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Add Budget</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <select value={budgetType} onChange={(e) => setBudgetType(e.target.value as "global" | "category")} className="p-3 border rounded-lg">
                        <option value="global">Global Budget</option>
                        <option value="category">Category Budget</option>
                    </select>

                    {budgetType === "global" ? (
                        <input type="number" value={totalBudgetLimit} onChange={(e) => setTotalBudgetLimit(e.target.value)} placeholder="Total Budget Limit" required />
                    ) : (
                        <>
                            <select value={categoryId ?? ""} onChange={(e) => setCategoryId(Number(e.target.value))} required>
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <input type="number" value={categoryBudgetLimit} onChange={(e) => setCategoryBudgetLimit(e.target.value)} placeholder="Category Budget Limit" required />
                        </>
                    )}

                    <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month" required />
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" required />

                    <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">Add Budget</button>
                    <button type="button" onClick={onClose} className="text-gray-600 text-center">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default BudgetForm;
