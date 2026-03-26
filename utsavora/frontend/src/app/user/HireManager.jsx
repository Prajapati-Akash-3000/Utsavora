import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { PageLoader } from "../../components/ui/Loading";
import { handleApiError } from "../../utils/handleApiError";

export default function HireManager() {
  const [managers, setManagers] = useState([]);
  const [eventCategory, setEventCategory] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const eventRes = await api.get(`/events/${eventId}/`);
        const catId = eventRes.data.category;
        setEventCategory(eventRes.data.category_details);
        setEventTitle(eventRes.data.title || "");
        
        const pkgUrl = catId ? `/events/packages/?category=${catId}` : `/events/packages/`;
        const pkgRes = await api.get(pkgUrl);
        setManagers(pkgRes.data);
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
        loadData();
    }
  }, [eventId]);

  const handleHire = async (packageId) => {
    if (!window.confirm("Are you sure you want to request this package?")) return;

    try {
      await api.post("/bookings/create/", {
        event_id: eventId,
        package_id: packageId
      });

      toast.success("Booking request sent! Waiting for manager approval.");
      navigate("/user/bookings");
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  // Random subtle gradient for each card
  const gradients = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-fuchsia-500 to-purple-600",
    "from-lime-500 to-green-600",
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pb-16">
      
      {/* TOP BAR */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(`/user/event/${eventId}`)}
            className="group flex items-center space-x-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-sm font-bold">Back to Event</span>
          </button>

          <div className="flex items-center space-x-3">
            {eventCategory && (
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {eventCategory.name}
              </span>
            )}
            <span className="hidden sm:inline text-xs text-gray-400 font-bold">
              {managers.length} package{managers.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Choose a package for<br />
            <span className="text-indigo-600">{eventTitle || "your event"}</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base font-medium">
            Compare packages from professional managers and select the best fit for your event.
          </p>
        </div>
      </div>

      {/* PACKAGES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {managers.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-300 flex items-center justify-center mx-auto mb-6 rotate-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No packages available</h3>
            <p className="text-gray-400 font-medium">No managers have listed packages for this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {managers.map((pkg, i) => {
              const gradient = gradients[i % gradients.length];
              return (
                <div 
                  key={pkg.id}
                  className="group bg-white rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden"
                >
                  {/* Card Top — colored header */}
                  <div className={`bg-gradient-to-br ${gradient} p-6 pt-7 pb-10 relative overflow-hidden`}>
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
                    
                    <div className="relative z-10 flex items-start justify-between">
                      {/* Manager Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-lg font-black border border-white/20">
                        {(pkg.manager_name || "M").charAt(0).toUpperCase()}
                      </div>
                      {/* Price Tag */}
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
                        <p className="text-white text-xl font-black leading-none">
                          ₹{Number(pkg.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 pt-5 flex-1 flex flex-col -mt-4 relative">
                    {/* Overlap pill */}
                    <div className="bg-white rounded-full shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 px-3 py-1.5 inline-flex items-center space-x-2 w-fit mb-4 -mt-6 relative z-10 transition-transform hover:scale-105">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      <span className="text-xs font-bold text-slate-600 truncate max-w-[160px]">{pkg.manager_name || "Professional Manager"}</span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors mb-3">
                      {pkg.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-3 mb-6">
                      {pkg.description || "Full event management package with professional coordination and support."}
                    </p>

                    <button
                      onClick={() => handleHire(pkg.id)}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.97] group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
                    >
                      Select Package
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
