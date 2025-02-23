import {Link} from "react-router-dom";

function Sidebar() {
    return (
        <div className="w-64 bg-gray-900 text-white h-screen p-4">
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
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
