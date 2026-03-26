import React from 'react';

export default function Skeleton({ className = "", variant = "rect" }) {
    const baseStyles = "bg-gray-200 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]";
    
    const variants = {
        rect: "w-full h-full",
        circle: "rounded-full",
        text: "h-4 rounded-md"
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`} />
    );
}

export function EventCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col w-full">
            <Skeleton className="h-48 w-full rounded-none" variant="rect" />
            <div className="p-6 flex-1 flex flex-col space-y-4">
                <Skeleton className="h-6 w-3/4 mb-2" variant="text" />
                <div className="space-y-3 mt-4 flex-1">
                    <div className="flex items-center gap-2">
                         <Skeleton className="h-4 w-4 rounded-full" variant="circle" />
                         <Skeleton className="h-4 w-1/2" variant="text" />
                    </div>
                    <div className="flex items-center gap-2">
                         <Skeleton className="h-4 w-4 rounded-full" variant="circle" />
                         <Skeleton className="h-4 w-2/3" variant="text" />
                    </div>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <Skeleton className="h-10 w-full rounded-lg" variant="rect" />
                </div>
            </div>
        </div>
    );
}
