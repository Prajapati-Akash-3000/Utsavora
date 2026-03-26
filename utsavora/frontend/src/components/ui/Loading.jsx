import React from 'react';

// Premium Uiverse.io-inspired Multi-Ring Glow Loader
export function LoadingSpinner({ size = "md", className = "", color = "indigo" }) {
    const sizes = {
        sm: "h-5 w-5",
        md: "h-10 w-10",
        lg: "h-16 w-16"
    };

    const borders = {
        sm: "border-2",
        md: "border-2 sm:border-3",
        lg: "border-[3px]"
    };

    // The color classes are specifically defined here to ensure Tailwind safelists them internally
    const getColorClass = (shade) => {
        if (color === "white") return `border-white/90`;
        return `border-${color}-${shade}`;
    };

    return (
        <div className={`relative flex justify-center items-center ${sizes[size]} ${className}`}>
            {/* Outer Fast Ring */}
            <div 
                className={`absolute inset-0 rounded-full border-t-transparent border-b-transparent ${borders[size]} ${color === 'white' ? 'border-l-white/80 border-r-white/80' : 'border-l-indigo-500 border-r-indigo-500'} opacity-80 animate-spin drop-shadow-md`} 
                style={{ animationDuration: '1s' }}
            ></div>
            {/* Middle Reverse Ring */}
            <div 
                className={`absolute inset-[10%] rounded-full border-l-transparent border-r-transparent ${borders[size]} ${color === 'white' ? 'border-t-white/60 border-b-white/60' : 'border-t-purple-400 border-b-purple-400'} opacity-90 animate-[spin_1.5s_linear_infinite_reverse] drop-shadow-sm`}
            ></div>
            {/* Inner Slow Ring */}
            <div 
                className={`absolute inset-[25%] rounded-full border-t-transparent border-b-transparent ${borders[size]} ${color === 'white' ? 'border-l-white/40 border-r-white/40' : 'border-l-fuchsia-400 border-r-fuchsia-400'} animate-[spin_2s_linear_infinite]`}
            ></div>
            <span className="sr-only">Loading...</span>
        </div>
    );
}

// Uiverse-inspired Shimmer Skeleton
export function LoadingSkeleton({ className = "" }) {
    return (
        <div className={`relative overflow-hidden bg-slate-100 rounded-[1rem] ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}

// Full page immersive glassmorphic loader
export function PageLoader() {
    return (
        <div className="min-h-screen fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020510]/80 backdrop-blur-xl">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <LoadingSpinner size="lg" color="indigo" />
                <p className="mt-8 text-indigo-200/80 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Loading Experience</p>
            </div>
        </div>
    );
}
