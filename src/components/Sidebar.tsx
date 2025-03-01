import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { apiService } from "../services/apiService";
import { User } from "../types/User";
import { FileText, Home, LogOut, PieChart, RefreshCcw, UserIcon } from "lucide-react";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
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

    // Function to determine if a link is active
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="flex flex-col bg-gray-900 text-white w-52 h-screen">
            {/* App name - fixed at top */}
            <div className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold">FinWise</h1>
            </div>

            {/* Main navigation - scrollable */}
            <div className="flex-1 overflow-y-auto">
                <nav className="py-2">
                    <ul>
                        <li className="mb-1">
                            <Link
                                to="/"
                                className={`flex items-center px-4 py-3 hover:bg-gray-800 ${
                                    isActive("/")
                                        ? "text-blue-500 border-b border-blue-500"
                                        : "text-gray-300 hover:text-white"
                                }`}
                            >
                                <Home size={18} className="mr-3" />
                                <span>Overview</span>
                            </Link>
                        </li>
                        <li className="mb-1">
                            <Link
                                to="/budget"
                                className={`flex items-center px-4 py-3 hover:bg-gray-800 ${
                                    isActive("/budget")
                                        ? "text-blue-500 border-b border-blue-500"
                                        : "text-gray-300 hover:text-white"
                                }`}
                            >
                                <PieChart size={18} className="mr-3" />
                                <span>Budget</span>
                            </Link>
                        </li>
                        <li className="mb-1">
                            <Link
                                to="/reports"
                                className={`flex items-center px-4 py-3 hover:bg-gray-800 ${
                                    isActive("/reports")
                                        ? "text-blue-500 border-b border-blue-500"
                                        : "text-gray-300 hover:text-white"
                                }`}
                            >
                                <FileText size={18} className="mr-3" />
                                <span>Reports</span>
                            </Link>
                        </li>
                        <li className="mb-1">
                            <Link
                                to="/transactions"
                                className={`flex items-center px-4 py-3 hover:bg-gray-800 ${
                                    isActive("/transactions")
                                        ? "text-blue-500 border-b border-blue-500"
                                        : "text-gray-300 hover:text-white"
                                }`}
                            >
                                <RefreshCcw size={18} className="mr-3" />
                                <span>Transactions</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Bottom fixed section - user, search and logout */}
            <div className="border-t border-gray-800 bg-gray-900">
                {/* User profile section */}
                <Link
                    to="/profile"
                    className={`flex items-center px-4 py-2 hover:bg-gray-800 ${
                        isActive("/profile")
                            ? "text-blue-500 border-b border-blue-500"
                            : "text-gray-300 hover:text-white"
                    }`}
                >
                    <UserIcon size={18} className="mr-3" />
                    <span className="truncate">{user?.name || "Unnamed"}</span>
                </Link>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                    <LogOut size={18} className="mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;