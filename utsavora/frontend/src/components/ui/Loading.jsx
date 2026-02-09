import React from 'react';

export function LoadingSpinner({ size = "md", className = "" }) {
    const sizes = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <svg 
                className={`animate-spin text-purple-600 ${sizes[size]}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
            >
                <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                ></circle>
                <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export function LoadingSkeleton({ className = "" }) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading Utsavora...</p>
        </div>
    );
}
