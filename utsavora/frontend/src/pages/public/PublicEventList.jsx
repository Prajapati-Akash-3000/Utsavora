import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Search, Calendar, MapPin, Tag } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { PageLoader } from "../../components/ui/Loading";

export default function PublicEventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchEvents = (q = "", cat = "") => {
    setLoading(true);
    const params = {};
    if (q) params.q = q;
    if (cat) params.category = cat;

    api.get("/events/public/", { params })
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to fetch public events", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
      // Combined initial fetch to avoid setState warning and optimize loading
      const initFetch = async () => {
          try {
              const [eventsRes, templatesRes] = await Promise.all([
                  api.get("/events/public/"),
                  api.get("/events/templates/")
              ]);
              setEvents(eventsRes.data);
              
              const uniqueCategories = [...new Set(templatesRes.data.map(t => t.category))];
              setCategories(uniqueCategories);
          } catch (err) {
              console.error("Failed to load initial data", err);
          } finally {
              setLoading(false);
          }
      };
      initFetch();
  }, []);

  const handleSearch = (e) => {
      e.preventDefault();
      fetchEvents(searchQuery, category);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover Amazing Events 🌍</h1>
        <p className="text-gray-600 text-lg">Browse public events and join the celebration!</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 w-full flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                  ))}
              </select>
              <Button type="submit" variant="primary">
                  Search
              </Button>
          </form>
      </div>

      {/* Events Grid */}
      {loading ? (
          <PageLoader />
      ) : events.length === 0 ? (
          <EmptyState 
            title="No events found"
            message="No public events found matching your search."
            actionLabel="Clear Filters"
            onAction={() => { setSearchQuery(""); setCategory(""); fetchEvents(); }}
            icon="search"
          />
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map(event => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full">
                      {/* Image / Preview */}
                      <div className="h-48 bg-purple-100 relative overflow-hidden">
                          {event.template_details?.preview_image ? (
                              <img 
                                src={event.template_details.preview_image} 
                                alt={event.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                          ) : (
                              <div className="flex items-center justify-center h-full text-purple-300">
                                  <Calendar className="w-16 h-16 opacity-50" />
                              </div>
                          )}
                          <div className="absolute top-4 right-4">
                              {event.pricing_type === 'PAID' ? (
                                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    ₹{event.registration_fee}
                                  </span>
                              ) : (
                                  <Badge status="FREE" className="bg-green-500 text-white border-green-600 shadow-sm" />
                              )}
                          </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={event.title}>{event.title}</h3>
                          
                          <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                              <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-purple-500" />
                                  <span>{event.start_date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-purple-500" />
                                  <span className="truncate">{event.venue}, {event.city}</span>
                              </div>
                              {event.template_details?.category && (
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-purple-500" />
                                    <span className="uppercase text-xs tracking-wider">{event.template_details.category}</span>
                                </div>
                              )}
                          </div>

                          <Link to={`/public/event/${event.id}`} className="mt-auto">
                            <Button className="w-full bg-gray-900 hover:bg-black text-white">
                                View Details & Register
                            </Button>
                          </Link>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}
