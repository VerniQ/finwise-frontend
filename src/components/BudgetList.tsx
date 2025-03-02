import React from "react";
import { Budget, BudgetCategory } from "../types/BudgetTypes";

interface BudgetListProps {
    budgets: Budget[];
    budgetCategories: BudgetCategory[];
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, budgetCategories }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
                <thead>
                <tr className="border-b text-left text-gray-500 text-sm">
                    <th className="font-medium py-4 px-6">Month</th>
                    <th className="font-medium py-4 px-6">Year</th>
                    <th className="font-medium py-4 px-6">Total Limit</th>
                    <th className="font-medium py-4 px-6">Category Budget</th>
                </tr>
                </thead>
                <tbody>
                {budgets.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="text-center py-6 text-gray-500">
                            No budgets found. Add your first budget!
                        </td>
                    </tr>
                ) : (
                    budgets.map((budget) => {
                        const categoryBudgets = budgetCategories.filter(
                            (category) => category.budgetId === budget.id
                        );

                        return (
                            <tr key={budget.id} className="border-b hover:bg-gray-50">
                                <td className="py-4 px-6">{budget.month}</td>
                                <td className="py-4 px-6">{budget.year}</td>
                                <td className="py-4 px-6 text-blue-600">
                                    {budget.totalBudgetLimit ? `$${budget.totalBudgetLimit.toFixed(2)}` : "-"}
                                </td>
                                <td className="py-4 px-6 text-blue-600">
                                    {categoryBudgets.length > 0
                                        ? categoryBudgets.map(
                                            (category) => `$${category.categoryBudgetLimit.toFixed(2)}`
                                        ).join(", ")
                                        : "-"}
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};

export default BudgetList;
