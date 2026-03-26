import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import BookingStatusBanner from "../../components/booking/BookingStatusBanner";
import PayAdvanceButton from "../../components/payment/PayAdvanceButton";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import InvitationRenderer from "../../invitations/engine/InvitationRenderer";
import { exportInvitation } from "../../invitations/engine/InvitationExport";
import { useRef } from "react";
import { CARD_SIZES } from "../../invitations/constants/cardSizes";
import MediaGallery from "../../components/MediaGallery";
import EventStatusTimeline from "../../components/event/EventStatusTimeline";
import PublicAttendeeList from "../../components/events/PublicAttendeeList";

// UI Components
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { PageLoader } from "../../components/ui/Loading";

const EXPORT_PRESETS = {
  original: { ...CARD_SIZES.INVITATION, name: 'invitation' },
  square: { ...CARD_SIZES.POST, name: 'post' },
  story: { ...CARD_SIZES.STORY, name: 'story' },
};

export default function UserEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [booking, setBooking] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [exportConfig, setExportConfig] = useState(EXPORT_PRESETS.original);
  const [activeTab, setActiveTab] = useState('details');
  const exportRef = useRef();
  
  // Dedicated Media State
  const [media, setMedia] = useState([]);
  const [memoryLimit, setMemoryLimit] = useState({ max_images: 5, uploaded: 0 });

  useEffect(() => {
    // Fetch Event Details
    api.get(`/events/${id}/`)
      .then(res => {
        console.log("EVENT DATA:", res.data);
        console.log("Event booking:", res.data?.booking); // Kept safe and logs the actual backend data
        setEvent(res.data);
        // Always sync booking state including null (handles cleared/rejected bookings)
        setBooking(res.data.booking || null);
      })
      .catch(err => {
          console.error("Error fetching event:", err);
      });
      
    // Fetch Media Separately
    api.get(`/events/${id}/media/`)
        .then(res => setMedia(res.data))
        .catch(err => console.error("Error fetching media:", err));

    // Fetch Memory Limit
    api.get(`/events/${id}/memory-limit/`)
        .then(res => setMemoryLimit(res.data))
        .catch(err => console.error("Error fetching memory limit:", err));
        
  }, [id]);

  const navigate = useNavigate();
  
  const handleDownloadInvitation = async (type = "original") => {
      if (!exportRef.current) return;
      const config = EXPORT_PRESETS[type];
      setExportConfig(config);
      setDownloading(true);
      
      // Allow state to update and layout to settle
      await new Promise(r => setTimeout(r, 100));

      try {
          await exportInvitation(exportRef.current, `invitation_${config.name}.png`);
          toast.success(`${config.name} download started!`);
      } catch (err) {
          console.error("Download failed", err);
          toast.error("Failed to download invitation");
      } finally {
          setDownloading(false);
      }
  };

  if (!event) {
    return <PageLoader />;
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
        return;
    }

    try {
        await api.delete(`/events/${event.id}/delete/`);
        toast.success("Event deleted successfully");
        navigate("/user/my-events");
    } catch (err) {
        toast.error(handleApiError(err));
    }
  };

  const eventStatus = event.status;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for date-only comparison
  
  const parseDateOnly = (dateStr) => {
    if (!dateStr) return null;
    // Handle YYYY-MM-DD format strictly
    const [y, m, d] = dateStr.split('T')[0].split('-');
    return new Date(y, m - 1, d);
  };

  const eventStartDate = parseDateOnly(event.start_date || event.start_datetime || event.event_date);
  if (eventStartDate) eventStartDate.setHours(0, 0, 0, 0);

  const eventEndDate = parseDateOnly(event.end_date || event.end_datetime || event.event_date);
  if (eventEndDate) eventEndDate.setHours(0, 0, 0, 0);

  const hasStartedOrIsToday = eventStartDate && today >= eventStartDate;
  const hasStrictlyEnded = eventEndDate && today > eventEndDate;

  // Event is considered "Ended" only if explicitly completed, cancelled, or the day HAS PASSED
  const eventEnded = eventStatus === "COMPLETED" || eventStatus === "CANCELLED" || hasStrictlyEnded;

  // Safely check if a manager can be hired: Must be BEFORE the start date
  const canHireManager = (!booking || booking?.status === "REJECTED") && 
                         !hasStartedOrIsToday && 
                         eventStatus !== "COMPLETED" && 
                         eventStatus !== "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* HERO SECTION */}
      <div className="relative bg-[#020617] text-white pb-36 pt-16 px-4 sm:px-6 overflow-hidden">
         {/* Animated Background Mesh */}
         <div className="absolute inset-0 z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse [animation-delay:2s]" />
             <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:4s]" />
         </div>
         
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <div className="space-y-6 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge status={event.status} className="bg-white/10 text-white border border-white/10 backdrop-blur-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]" />
                        {(event.is_public || event.visibility === "PUBLIC") && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">Public Event</span>
                        )}
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] max-w-4xl drop-shadow-2xl">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-slate-400 font-bold text-sm tracking-wide">
                        <div className="flex items-center group/info">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover/info:bg-white/10 transition-colors">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <span>{new Date(event.start_datetime || event.event_date || event.start_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center group/info">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover/info:bg-white/10 transition-colors">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <span>{event.city || "Online Event"}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4 lg:mb-2">
                    {canHireManager && (
                        <button 
                            onClick={() => navigate(`/user/event/${event.id}/hire`)}
                            className="bg-white text-slate-900 hover:bg-slate-100 shadow-2xl shadow-white/10 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 animate-bounce-subtle inline-flex items-center justify-center"
                        >
                            Hire Manager
                        </button>
                    )}
                    <button 
                        onClick={() => navigate('/user/my-events')}
                        className="bg-white/5 text-white hover:bg-white/10 border border-white/10 backdrop-blur-2xl px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all inline-flex items-center justify-center"
                    >
                        ← My Events
                    </button>
                </div>
            </div>
         </div>
         
         {/* Bottom Fade Gradient */}
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50/50 to-transparent pointer-events-none" />
      </div>

      <style>{`
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
            animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-20 space-y-8">
        {booking && <BookingStatusBanner booking={booking} className="shadow-2xl rounded-2xl overflow-hidden border-0" />}
        
        {/* CANCELLED WARNING */}
        {event.status === "CANCELLED" && (
          <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md text-red-400 px-6 py-4 rounded-2xl text-center font-bold shadow-xl">
              <span className="mr-2">⚠️</span> This event has been cancelled
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Main Content */}
            <div className="lg:col-span-2 space-y-6">
                {/* TABS NAVIGATION */}
                <div className="relative bg-white p-1.5 rounded-[2rem] shadow-sm border border-gray-100 inline-flex w-full sm:w-auto overflow-hidden">
                    {/* Sliding indicator */}
                    <div 
                        className="absolute h-[calc(100%-12px)] top-[6px] transition-all duration-500 ease-in-out bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-200"
                        style={{
                            width: activeTab === 'details' ? '120px' : activeTab === 'media' ? '110px' : '130px',
                            left: activeTab === 'details' ? '6px' : activeTab === 'media' ? '126px' : '236px',
                        }}
                    />
                    {[
                        { id: 'details', label: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', w: '120px' },
                        { id: 'media', label: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h18M10 9l-2 2m0 0l-2-2m2 2v6', w: '110px' },
                        { id: 'attendees', label: 'Guest List', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', w: '130px' }
                    ]
                    .filter(tab => tab.id !== 'attendees' || (event.is_public || event.visibility === "PUBLIC"))
                    .map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ width: tab.w }}
                            className={`relative z-10 flex items-center justify-center space-x-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
                                activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-indigo-600'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon}></path></svg>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                <div className="transition-all duration-500 ease-in-out">
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                                    </span>
                                    About the Event
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                    {event.description || "No description provided for this event."}
                                </p>
                            </div>

                            {/* Additional Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                                   <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Date & Time</p>
                                   <p className="text-gray-900 font-bold text-lg">
                                       {new Date(event.start_datetime || event.event_date || event.start_date).toLocaleDateString()}
                                   </p>
                                   <p className="text-gray-500 text-sm">{event.start_time || "All day event"}</p>
                               </div>
                               <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
                                   <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Location</p>
                                   <p className="text-gray-900 font-bold text-lg">{event.city || "Venue TBD"}</p>
                                   <p className="text-gray-500 text-sm">{event.address || "Location details hidden"}</p>
                               </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-gray-900">Event Memories</h3>
                                <Badge className="bg-purple-100 text-purple-700 border-0">{media.length} Photos</Badge>
                            </div>
                            
                            {event.can_upload_media && (
                                <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 relative overflow-hidden group">
                                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-indigo-900">Share your moments</h4>
                                            <p className="text-sm text-indigo-600/80 mb-1">
                                                Upload up to <span className="font-bold">{memoryLimit.max_images}</span> photos by {new Date(event.media_upload_deadline).toLocaleDateString()}
                                            </p>
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {memoryLimit.uploaded} / {memoryLimit.max_images} images uploaded
                                            </div>
                                        </div>
                                        {media.length >= memoryLimit.max_images ? (
                                            <p className="text-red-500 font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-red-100">
                                                Limit reached ({memoryLimit.max_images})
                                            </p>
                                        ) : (
                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;
                        
                                                        const formData = new FormData();
                                                        formData.append('image', file);
                        
                                                        const toastId = toast.loading("Uploading memory...");
                                                        try {
                                                            await api.post(`/events/${event.id}/media/upload/`, formData);
                                                                    toast.success("Memory uploaded!", { id: toastId });
                                                                    
                                                                    const res = await api.get(`/events/${id}/media/`);
                                                                    setMedia(res.data);
                                                                    
                                                                    const limitRes = await api.get(`/events/${id}/memory-limit/`);
                                                                    setMemoryLimit(limitRes.data);
                                                                    
                                                                    const eventRes = await api.get(`/events/${id}/`);
                                                                    setEvent(eventRes.data);
                                                        } catch (err) {
                                                                    toast.error(handleApiError(err), { id: toastId });
                                                        }
                                                        e.target.value = null;
                                                    }}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                                                />
                                                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200">
                                                   Select Photo
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500" />
                                </div>
                            )}

                            <MediaGallery images={media} />
                        </div>
                    )}

                    {activeTab === 'attendees' && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Guest List</h3>
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>
                            <PublicAttendeeList key={event.id} eventId={event.id} />
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: Sidebar */}
            <div className="space-y-6">
                {/* STATUS TIMELINE SIDEBAR */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3" />
                        Live Progress
                    </h2>
                    <EventStatusTimeline event={event} />
                </div>

                {/* QUICK ACTIONS / PAYMENTS */}
                {(booking?.status === "ACCEPTED" || booking?.status === "CONFIRMED") && (
                    <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
                         <div className="relative z-10 space-y-4">
                            <h3 className="text-lg font-bold">Manage Payment</h3>
                            <p className="text-white/80 text-sm">Secure your booking by processing the payment directly from here.</p>
                            
                            {booking.status === "ACCEPTED" && booking.payment_status !== "PAID" && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Advance Required</p>
                                    <PayAdvanceButton bookingId={booking.id} />
                                </div>
                            )}

                            {booking.status === "CONFIRMED" && eventEnded && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Final Settlement</p>
                                    <PayFinalButton bookingId={booking.id} />
                                </div>
                            )}
                         </div>
                         <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                    </div>
                )}

                {/* INVITATION & SHARE */}
                {(event.invitation_template_key || event.template) && eventStatus !== "CANCELLED" && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                        <h4 className="text-lg font-bold text-gray-900">Shareables</h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => handleDownloadInvitation("original")}
                                disabled={downloading}
                                className="group flex flex-col items-center justify-center p-4 bg-purple-50 rounded-2xl border border-purple-100 transition-all hover:bg-purple-100 active:scale-95"
                            >
                                <span className="text-purple-600 font-bold mb-1">2:3</span>
                                <span className="text-[10px] font-bold text-purple-400 uppercase">Poster</span>
                            </button>
                            <button 
                                onClick={() => handleDownloadInvitation("square")}
                                disabled={downloading}
                                className="group flex flex-col items-center justify-center p-4 bg-pink-50 rounded-2xl border border-pink-100 transition-all hover:bg-pink-100 active:scale-95"
                             >
                                <span className="text-pink-600 font-bold mb-1">1:1</span>
                                <span className="text-[10px] font-bold text-pink-400 uppercase">Square</span>
                            </button>
                            <button 
                                onClick={() => handleDownloadInvitation("story")}
                                disabled={downloading}
                                className="group flex flex-col items-center justify-center p-4 bg-blue-50 rounded-2xl border border-blue-100 transition-all hover:bg-blue-100 active:scale-95 sm:col-span-2"
                            >
                                <span className="text-blue-600 font-bold mb-1">9:16</span>
                                <span className="text-[10px] font-bold text-blue-400 uppercase">Story / Status</span>
                            </button>
                        </div>

                        {downloading && (
                            <div className="flex items-center justify-center space-x-2 text-indigo-600 animate-pulse">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                                <span className="text-xs font-bold">Generating...</span>
                            </div>
                        )}
                    </div>
                )}

                {/* DANGER ZONE — hidden if booking is paid */}
                {!(booking && booking.payment_status === "FULLY_PAID") && (
                <div className="pt-4">
                    <button 
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl text-red-500 font-bold border-2 border-red-50/50 hover:bg-xl transition-all hover:border-red-100 group"
                    >
                        <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <span>Delete Event</span>
                    </button>
                </div>
                )}
            </div>
        </div>

        {/* Hidden export canvas */}
        <div className="fixed left-[-99999px] top-0" style={{ overflow: 'hidden' }}>
            <div
                id="invitation-canvas"
                ref={exportRef}
                style={{
                    width: exportConfig.width,
                    height: exportConfig.height,
                    overflow: 'hidden',
                    background: '#fff',
                }}
            >
                <div style={{ width: '100%', height: '100%' }}>
                    <InvitationRenderer
                        template={event.invitation_template_key || event.template_details?.template_key || event.template || 'birthday'}
                        data={event}
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
