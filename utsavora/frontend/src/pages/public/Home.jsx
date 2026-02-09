import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("All");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (city) params.append("city", city);
        if (category && category !== "All") params.append("category", category);
        
        navigate(`/public/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* HERO SECTION */}
            <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-4xl w-full text-center space-y-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 pb-2">
                        Utsavora
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover amazing events, book top-tier managers, and create memories that last a lifetime.
                    </p>

                    {/* SEARCH BOX */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl mt-10 max-w-3xl mx-auto w-full border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                placeholder="Event Name..."
                                className="border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-gray-50 focus:bg-white transition"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <input
                                placeholder="City (e.g. Mumbai)..."
                                className="border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-gray-50 focus:bg-white transition"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                            />
                             <select 
                                className="border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-gray-50 focus:bg-white transition"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Birthday">Birthday</option>
                                <option value="Music">Music</option>
                                <option value="Workshop">Workshop</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="w-full mt-4 bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-md hover:shadow-lg active:scale-95 transform"
                        >
                            Search Events
                        </button>
                    </div>

                    {/* LINK CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
                        <Link to="/login/user" className="group">
                             <div className="p-6 rounded-xl hover:bg-white hover:shadow-lg transition border border-transparent hover:border-gray-100 flex items-center justify-center space-x-3 text-gray-600 group-hover:text-blue-600">
                                <span className="font-semibold">Login as User</span>
                                <span>&rarr;</span>
                             </div>
                        </Link>
                        <Link to="/login/manager" className="group">
                             <div className="p-6 rounded-xl hover:bg-white hover:shadow-lg transition border border-transparent hover:border-gray-100 flex items-center justify-center space-x-3 text-gray-600 group-hover:text-purple-600">
                                <span className="font-semibold">Login as Manager</span>
                                <span>&rarr;</span>
                             </div>
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* FOOTER SIMPLE */}
            <div className="bg-white py-6 border-t text-center text-gray-400 text-sm">
                &copy; 2026 Utsavora. All rights reserved.
            </div>
        </div>
    );
}
