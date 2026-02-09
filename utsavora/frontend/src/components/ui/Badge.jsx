import React from 'react';

export default function Badge({ status, className = "" }) {
    
    const variants = {
        ACTIVE: "bg-green-100 text-green-700 border-green-200",
        PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
        CONFIRMED: "bg-purple-100 text-purple-700 border-purple-200",
        COMPLETED: "bg-gray-100 text-gray-700 border-gray-200",
        CANCELLED: "bg-red-100 text-red-700 border-red-200",
        // Extended for payment/booking statuses
        PAID: "bg-green-100 text-green-700 border-green-200",
        ACCEPTED: "bg-purple-100 text-purple-700 border-purple-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200",
        REFUNDED: "bg-orange-100 text-orange-700 border-orange-200",
        PUBLIC: "bg-blue-100 text-blue-700 border-blue-200",
        PRIVATE: "bg-gray-100 text-gray-600 border-gray-200"
    };

    const style = variants[status] || "bg-gray-100 text-gray-600";
    
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${style} ${className}`}>
            {status}
        </span>
    );
}
