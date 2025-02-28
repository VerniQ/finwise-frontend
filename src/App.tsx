import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { authService } from "./services/authService";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isLoggedIn());

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(authService.isLoggedIn());
        };

        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    useEffect(() => {
    }, [isAuthenticated]);

    return (
        <>
            {isAuthenticated ? (
                // Authenticated layout with sidebar
                <div className="flex min-h-auto">
                    <Sidebar />
                    <div className="flex-1 p-6 flex flex-col">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/budget" element={<Budget />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
            ) : (
                // Unauthenticated routes
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </>
    );
}

export default App;