import React from 'react';

export default function Button({ 
    children, 
    onClick, 
    type = "button", 
    variant = "primary", // primary, secondary, outline, danger, ghost
    size = "md", // sm, md, lg
    disabled = false,
    loading = false,
    className = "",
    ...props 
}) {
    
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-md hover:shadow-lg transform active:scale-95",
        secondary: "bg-purple-100 text-purple-700 hover:bg-purple-200 focus:ring-purple-300",
        outline: "border-2 border-primary text-primary hover:bg-purple-50 focus:ring-primary",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        white: "bg-white text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "p-2"
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
