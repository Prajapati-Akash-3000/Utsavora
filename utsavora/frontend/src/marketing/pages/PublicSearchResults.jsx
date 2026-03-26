import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { PageLoader } from "../../components/ui/Loading";

export default function PublicSearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get params
    const q = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchEvents = async () => {
            setLoading(true);
            try {
                // Build query string
                const params = new URLSearchParams();
                if (q) params.append("q", q);
                if (city) params.append("city", city);
                if (category && category !== "All") params.append("category", category);

                const res = await api.get(`/events/public/search/?${params.toString()}`);
                if (isMounted) {
                    setEvents(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch public events", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchEvents();

        return () => { isMounted = false; };
    }, [q, city, category]);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Search Results {q && `for "${q}"`} {city && `in ${city}`}
                </h2>
                <Button 
                    onClick={() => navigate("/")}
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-800"
                >
                    &larr; Back to Search
                </Button>
            </div>

            {loading ? (
                <PageLoader />
            ) : events.length === 0 ? (
                <EmptyState 
                    title="No events found"
                    message="No events found matching your criteria."
                    actionLabel="Try New Search"
                    onAction={() => navigate("/")}
                    icon="search"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                         <div
                            key={event.id}
                            className="bg-white border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group h-full flex flex-col"
                            onClick={() => navigate(`/public/events/${event.id}`)}
                        >
                            {/* Image Placeholder or Preview */}
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <img 
                                    src={event.template_details?.preview_image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"} 
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {event.category || "General"}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">{event.title}</h3>
                                </div>
                                
                                <div className="space-y-2 mb-4 flex-1">
                                    <p className="text-gray-500 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {event.city}
                                    </p>
                                    <p className="text-gray-500 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(event.start_date).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                    {event.pricing_type === "FREE" ? (
                                        <Badge status="FREE" className="bg-green-50 text-green-600 border-green-100" />
                                    ) : (
                                        <span className="text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full text-sm">
                                            ₹{event.registration_fee}
                                        </span>
                                    )}
                                    
                                    <span className="text-gray-400 text-sm group-hover:text-purple-500 transition-colors flex items-center">
                                        Details <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
