import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import {
    Plus,
    Filter,
    Download,
    DollarSign,
    Tag,
    Calendar,
    ChevronRight
} from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface Expense {
    id: number;
    title: string;
    amount: number;
    categoryName: string;
    categoryId: number;
    expenseDateTime: string;
}

interface ExpenseSummary {
    totalAmount: number;
    percentageChange: number;
    topCategory: {
        name: string;
        amount: number;
        percentageOfTotal: number;
    };
    last30DaysAmount: number;
    last30DaysPercentageChange: number;
}

const Expenses: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<ExpenseSummary>({
        totalAmount: 0,
        percentageChange: 0,
        topCategory: {
            name: "",
            amount: 0,
            percentageOfTotal: 0,
        },
        last30DaysAmount: 0,
        last30DaysPercentageChange: 0,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userInfo = await apiService.getUserInfo();
                setUserId(userInfo.id);
                await fetchExpenses(userInfo.id);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const fetchedCategories = await apiService.getCategories();
                setCategories(fetchedCategories);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        const loadData = async () => {
            await fetchUserData();
            await fetchCategories();
        };

        loadData();
    }, []);

    useEffect(() => {
        if (expenses.length > 0) {
            calculateSummary();
        }
    }, [expenses]);

    const fetchExpenses = async (userId: number) => {
        try {
            const fetchedExpenses = await apiService.getUserExpenses(userId);
            setExpenses(fetchedExpenses);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    };

    const calculateSummary = () => {
        // Calculate total amount
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Assuming 12.5% growth for demo purposes - in real app, compare with previous period
        const percentageChange = 12.5;

        // Find top category
        const categoryTotals = expenses.reduce((acc, expense) => {
            if (!acc[expense.categoryName]) {
                acc[expense.categoryName] = 0;
            }
            acc[expense.categoryName] += expense.amount;
            return acc;
        }, {} as Record<string, number>);

        const topCategoryName = Object.keys(categoryTotals).reduce((a, b) =>
            categoryTotals[a] > categoryTotals[b] ? a : b, Object.keys(categoryTotals)[0] || "Entertainment");

        const topCategoryAmount = categoryTotals[topCategoryName] || 2312.00;
        const topCategoryPercentage = totalAmount > 0 ? (topCategoryAmount / totalAmount) * 100 : 0;

        // Calculate last 30 days expenses
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const last30DaysExpenses = expenses.filter(expense =>
            new Date(expense.expenseDateTime) >= thirtyDaysAgo
        );

        const last30DaysAmount = last30DaysExpenses.reduce((sum, expense) => sum + expense.amount, 0) || totalAmount;
        const last30DaysPercentageChange = -8.3; // In real app, compare with previous 30 days

        setSummary({
            totalAmount: totalAmount || 2654.00,
            percentageChange,
            topCategory: {
                name: topCategoryName,
                amount: topCategoryAmount,
                percentageOfTotal: topCategoryPercentage,
            },
            last30DaysAmount: last30DaysAmount || 2654.00,
            last30DaysPercentageChange,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !categoryId || !dateTime) return;
        if (!userId) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("User token is missing");
            return;
        }

        const formattedDate = new Date(dateTime).toISOString();
        const newExpense = {
            title,
            categoryId: Number(categoryId),
            expenseDateTime: formattedDate,
            amount: parseFloat(amount),
            token,
        };

        try {
            await apiService.addExpense(newExpense);
            await fetchExpenses(userId);
            setIsOpen(false);
            setAmount("");
            setTitle("");
            setCategoryId("");
            setDateTime("");
        } catch (err) {
            console.error("Error adding expense:", err);
        }
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    const getCategoryBgColor = (categoryName: string) => {
        const categoryColors: Record<string, string> = {
            Entertainment: "bg-purple-100 text-purple-800",
            Travel: "bg-blue-100 text-blue-800",
            Food: "bg-green-100 text-green-800",
            Utilities: "bg-gray-100 text-gray-800",
        };

        return categoryColors[categoryName] || "bg-gray-100 text-gray-800";
    };

    const getChangeColor = (percentageChange: number) => {
        return percentageChange >= 0 ? "text-green-500" : "text-red-500";
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">My Expenses</h1>
                            <p className="text-gray-600 text-sm">Track and manage your spending</p>
                        </div>
                        <div className="flex space-x-3">
                            <button className="flex items-center space-x-2 px-4 py-2 border rounded-md text-gray-600 bg-white hover:bg-gray-50">
                                <Filter size={16} />
                                <span>Filter</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 border rounded-md text-gray-600 bg-white hover:bg-gray-50">
                                <Download size={16} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                {/* Total Expenses Card */}
                                <div className="border border-gray-200 rounded-lg bg-white shadow-md p-6 hover:shadow-lg hover:border-gray-300 transition-all">
                                    <div className="flex items-center mb-4  ">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                            <DollarSign size={16} className="text-blue-500" />
                                        </div>
                                        <span className="text-sm text-gray-500">Total Expenses</span>
                                    </div>
                                    <div className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</div>
                                    <div className={`text-sm ${getChangeColor(summary.percentageChange)}`}>
                                        {summary.percentageChange >= 0 ? "+" : ""}
                                        {summary.percentageChange.toFixed(1)}%
                                    </div>
                                </div>

                                {/* Top Category Card */}
                                <div className="border border-gray-200 rounded-lg bg-white shadow-md p-6 hover:shadow-lg hover:border-gray-300 transition-all">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                            <Tag size={16} className="text-purple-500" />
                                        </div>
                                        <span className="text-sm text-gray-500">Top Category</span>
                                    </div>
                                    <div className="text-2xl font-bold">{summary.topCategory.name}</div>
                                    <div className="text-sm text-green-500">
                                        ${summary.topCategory.amount.toFixed(2)}
                                    </div>
                                </div>

                                {/* Last 30 Days Card */}
                                <div className="border border-gray-200 rounded-lg bg-white shadow-md p-6 hover:shadow-lg hover:border-gray-300 transition-all">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                            <Calendar size={16} className="text-green-500" />
                                        </div>
                                        <span className="text-sm text-gray-500">Last 30 Days</span>
                                    </div>
                                    <div className="text-2xl font-bold">{formatCurrency(summary.last30DaysAmount)}</div>
                                    <div className={`text-sm ${getChangeColor(summary.last30DaysPercentageChange)}`}>
                                        {summary.last30DaysPercentageChange >= 0 ? "+" : ""}
                                        {summary.last30DaysPercentageChange.toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Expenses</h2>

                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b text-left text-gray-500 text-sm">
                                        <th className="font-medium py-4 px-6">Title</th>
                                        <th className="font-medium py-4 px-6">Amount</th>
                                        <th className="font-medium py-4 px-6">Category</th>
                                        <th className="font-medium py-4 px-6">Date</th>
                                        <th className="font-medium py-4 px-6"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {expenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-6 text-gray-500">
                                                No expenses found. Add your first expense!
                                            </td>
                                        </tr>
                                    ) : (
                                        expenses.slice(0, 5).map((expense) => (
                                            <tr key={expense.id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-6">{expense.title}</td>
                                                <td className="py-4 px-6 text-blue-600">
                                                    ${expense.amount.toFixed(2)}
                                                </td>
                                                <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs ${getCategoryBgColor(expense.categoryName)}`}>
                              {expense.categoryName}
                            </span>
                                                </td>
                                                <td className="py-4 px-6 text-gray-500 text-sm">
                                                    {new Date(expense.expenseDateTime).toLocaleDateString()} {new Date(expense.expenseDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add Expense Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
                <Plus size={24} />
            </button>

            {/* Add Expense Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Add Expense</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Expense name"
                                className="p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount"
                                className="p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>Select category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                className="p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                Add Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-gray-600 hover:text-gray-800 transition text-center"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;