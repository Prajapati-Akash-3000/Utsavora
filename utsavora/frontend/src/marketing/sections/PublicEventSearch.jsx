import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function PublicEventSearch() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filter States
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceFilter, setPriceFilter] = useState("ALL"); // ALL, FREE, PAID

  // Derived Categories for Dropdown
  const categories = ["All", ...new Set(events.map(e => e.category).filter(Boolean))];

  useEffect(() => {
    api.get("/events/public/")
      .then(res => {
        setEvents(res.data);
        setFilteredEvents(res.data);
      })
      .catch(err => console.error("Failed to fetch public events", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = events;

    // 1. Search Query (Title or City)
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(lowerQuery) || 
        e.city.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Category Filter
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(e => e.category === selectedCategory);
    }

    // 3. Price Filter
    if (priceFilter !== "ALL") {
      result = result.filter(e => e.pricing_type === priceFilter);
    }

    setFilteredEvents(result);
  }, [query, selectedCategory, priceFilter, events]);

  if (loading) return <div className="text-center py-10">Loading events...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Explore Public Events</h2>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <input
            placeholder="Search by Event Name or City..."
            className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {/* Filters Container */}
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {/* Category Dropdown */}
            <select 
                className="border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
            >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            {/* Price Filter Buttons */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                {['ALL', 'FREE', 'PAID'].map(type => (
                    <button
                        key={type}
                        onClick={() => setPriceFilter(type)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            priceFilter === type 
                            ? 'bg-white text-purple-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {type === 'ALL' ? 'Any Price' : type}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* EVENT GRID */}
      {filteredEvents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
              <p className="text-xl">No events found matching your criteria.</p>
              <button 
                onClick={() => {setQuery(""); setSelectedCategory(""); setPriceFilter("ALL");}}
                className="mt-4 text-purple-600 font-medium hover:underline"
              >
                  Clear all filters
              </button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
            <div
                key={event.id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
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

                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">{event.title}</h3>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <p className="text-gray-500 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {event.city}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {new Date(event.start_date).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        {event.pricing_type === "FREE" ? (
                            <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">Free</span>
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
