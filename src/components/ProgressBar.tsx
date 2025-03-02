import React from "react";

interface ProgressBarProps {
    percentage: number;
    color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color = "bg-blue-500" }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
                className={`${color} h-4 transition-all duration-300`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export default ProgressBar;
