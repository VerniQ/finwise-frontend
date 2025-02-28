import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { apiService } from "../services/apiService";
import { User } from "../types/User";

function Sidebar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData: User = await apiService.getUserInfo();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        authService.logout();
        window.dispatchEvent(new Event("storage"));
        navigate('/login');
    };

    return (
        <div className="w-64 h-auto bg-gray-900 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-6">FinWise</h1>
            <nav>
                <ul>
                    <li className="mb-4">
                        <Link to="/" className="flex items-center space-x-2 hover:text-gray-400">
                            <span>🏠</span> <span>Overview</span>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link to="/budget" className="flex items-center space-x-2 hover:text-gray-400">
                            <span>💰</span> <span>Budget</span>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link to="/reports" className="flex items-center space-x-2 hover:text-gray-400">
                            <span>📊</span> <span>Reports</span>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link to="/transactions" className="flex items-center space-x-2 hover:text-gray-400">
                            <span>🔄</span> <span>Transactions</span>
                        </Link>
                    </li>
                    {user && (
                        <li className="mt-8 pt-4 border-t border-gray-700 flex items-center space-x-2">
                            <span>🧑</span>
                            <span>{user.name || user.email}</span>
                        </li>
                    )}

                    <li className="mb-3 mt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 hover:text-gray-400 text-left"
                        >
                            <span>🚪</span> <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
