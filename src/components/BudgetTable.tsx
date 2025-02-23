import React from "react";

const budgetData = [
    { category: "Groceries", budgeted: 350, actual: 470 },
    { category: "Entertainment", budgeted: 100, actual: 150 },
    { category: "Transport", budgeted: 70, actual: 50 },
    { category: "Internet", budgeted: 80, actual: 80 },
];

const BudgetTable: React.FC = () => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <table className="w-full border-collapse">
                <thead>
                <tr className="border-b">
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Budgeted</th>
                    <th className="text-left p-2">Actual</th>
                    <th className="text-left p-2">Remaining</th>
                </tr>
                </thead>
                <tbody>
                {budgetData.map((item, index) => {
                    const remaining = item.budgeted - item.actual;
                    return (
                        <tr key={index} className="border-b">
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">€{item.budgeted.toFixed(2)}</td>
                            <td className="p-2">€{item.actual.toFixed(2)}</td>
                            <td className={`p-2 ${remaining < 0 ? "text-red-500" : "text-green-500"}`}>
                                €{remaining.toFixed(2)}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default BudgetTable;