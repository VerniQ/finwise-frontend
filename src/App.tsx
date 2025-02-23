import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";

function App() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/budget" element={<Budget />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
