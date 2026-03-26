import React from 'react';
import { LoadingSpinner } from './Loading';

export default function Button({ 
    children, 
    onClick, 
    type = "button", 
    variant = "primary", // premium, primary, secondary, outline, danger, ghost, white
    size = "md", // sm, md, lg, icon
    disabled = false,
    loading = false,
    className = "",
    ...props 
}) {
    
    // Core smooth interactions
    const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all duration-300 ease-out rounded-[1rem] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
    
    // Uiverse.io Inspired Variants
    const variants = {
        // High-end glowing border button with internal shine
        premium: "bg-[#0a0f25] border border-white/10 text-white hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 shadow-[0_4px_20px_-5px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_30px_-5px_rgba(99,102,241,0.4)] transform active:scale-[0.97]",
        
        // Classic elevated primary button
        primary: "bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/20 shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-[1px] transform active:scale-[0.97]",
        
        // Soft secondary with hover depth
        secondary: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 border border-transparent hover:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 transform active:scale-[0.97]",
        
        // Crisp outline
        outline: "border-2 border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transform active:scale-[0.97] bg-transparent",
        
        // Bright danger
        danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-4 focus:ring-rose-500/20 shadow-[0_4px_14px_0_rgb(225,29,72,0.39)] hover:-translate-y-[1px] transform active:scale-[0.97]",
        
        // Invisible ghost perfectly flat
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 transform active:scale-[0.97]",
        
        // Standard white
        white: "bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md transform active:scale-[0.97]"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "p-2.5"
    };

    const isWhiteText = ['primary', 'danger', 'premium'].includes(variant);

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {/* Uiverse Premium Ambient Glow & Shine Effects */}
            {variant === 'premium' && (
                <>
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-lg pointer-events-none"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></span>
                </>
            )}
            {/* Standard Shine Effect for Primary/Danger */}
            {(variant === 'primary' || variant === 'danger') && (
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-t-[1rem]"></span>
            )}

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>

            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                    <div className="mr-1">
                        <LoadingSpinner size="sm" color={isWhiteText ? 'white' : 'indigo'} />
                    </div>
                )}
                <span className={loading ? 'opacity-90' : 'opacity-100'}>
                    {children}
                </span>
            </span>
        </button>
    );
}
