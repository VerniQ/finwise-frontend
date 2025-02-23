import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiService";

const Dashboard = () => {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await apiService.getCategories();
            console.log("Fetched categories:", data);
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                console.error("API response is not an array:", data);
            }
            setLoading(false);
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Loading categories...</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
            {categories.length === 0 ? (
                <p className="text-center text-gray-500">No categories available.</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <li key={category.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-xl font-semibold">{category.name}</h2>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;