import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import BookingStatusBanner from "../../components/booking/BookingStatusBanner";
import PayAdvanceButton from "../../components/payment/PayAdvanceButton";
import PayFinalButton from "../../components/payment/PayFinalButton";
import TemplateRenderer from "../../invitations/TemplateRenderer";
import * as htmlToImage from "html-to-image";
import toast from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";
import InvitationCanvas from "../../invitations/InvitationCanvas";
import MediaGallery from "../../components/MediaGallery";
import EventStatusTimeline from "../../components/event/EventStatusTimeline";
import PublicAttendeeList from "../../components/events/PublicAttendeeList";

// UI Components
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { PageLoader } from "../../components/ui/Loading";

const EXPORT_PRESETS = {
  original: { width: 1080, height: null, pixelRatio: 2, name: 'original' },
  square: { width: 1080, height: 1080, pixelRatio: 2, name: 'square' },
  story: { width: 1080, height: 1920, pixelRatio: 2, name: 'story' },
  print: { width: 1748, height: 2480, pixelRatio: 4, name: 'print' }, // A5 @ 300dpi approx
};

export default function UserEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [booking, setBooking] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [exportConfig, setExportConfig] = useState(EXPORT_PRESETS.original);
  const [activeTab, setActiveTab] = useState('details');
  
  // Dedicated Media State
  const [media, setMedia] = useState([]);

  useEffect(() => {
    // Fetch Event Details
    api.get(`/events/${id}/`)
      .then(res => {
        console.log("EVENT DATA:", res.data);
        setEvent(res.data);
        // Map manager_booking to local booking state for backward compatibility with banners
        if (res.data.manager_booking) {
            setBooking(res.data.manager_booking);
        }
      })
      .catch(err => {
          console.error("Error fetching event:", err);
      });
      
    // Fetch Media Separately
    api.get(`/events/${id}/media/`)
        .then(res => setMedia(res.data))
        .catch(err => console.error("Error fetching media:", err));
        
  }, [id]);

  const navigate = useNavigate();
  
  const handleDownloadInvitation = async (type = "original") => {
      const node = document.getElementById("invitation-canvas");
      if (!node) return;
      
      const config = EXPORT_PRESETS[type];
      setExportConfig(config);
      setDownloading(true);

      // Brief delay to allow React to render the new dimensions
      await new Promise(r => setTimeout(r, 300));

      try {
          const dataUrl = await htmlToImage.toPng(node, {
            quality: 1.0,
            pixelRatio: config.pixelRatio,
            backgroundColor: "#ffffff",
          });
          
          const link = document.createElement("a");
          link.download = `${event.title.replace(/\s+/g, '_')}_${type}.png`;
          link.href = dataUrl;
          link.click();
          toast.success(`Downloaded ${type} invitation!`);
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

  const eventEnded = new Date() > new Date(event.end_datetime || event.end_date); // Handle backend inconsistencies if any

  return (
    <div className="p-6 space-y-6">
      {booking && <BookingStatusBanner booking={booking} />}
      
      {/* CANCELLED WARNING */}
      {event.status === "CANCELLED" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center font-bold">
            ❌ This event has been cancelled
        </div>
      )}

      {/* TIMELINE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Event Status</h2>
          <EventStatusTimeline event={event} />
      </div>

      {/* BANNER: Event Scheduled (Only when confirmed) */}
      {event.status === "CONFIRMED" && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm">
          <p className="font-bold">Event Scheduled</p>
          <p>You're all set! Your event is confirmed.</p>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`${
                activeTab === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Event Details
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`${
                activeTab === 'media'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Memories & Gallery
            </button>
            {/* Show Attendees Tab only if Public */}
            {(event.is_public || event.visibility === "PUBLIC") && (
                <button
                onClick={() => setActiveTab('attendees')}
                className={`${
                    activeTab === 'attendees'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                Attendees
                </button>
            )}
          </nav>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'details' && (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
            <div className="grid grid-cols-2 gap-4 mt-4 text-gray-600">
                <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p>{new Date(event.start_datetime || event.event_date || event.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge status={event.status} />
                </div>
                <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="mt-1">{event.description}</p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="col-span-2 mt-4 space-y-3">
                    
                    {/* 1. Hire Manager */}
                    {event.status === "ACTIVE" && (!booking || booking.status === "REJECTED" || booking.status === "CANCELLED") && (
                        <Button 
                            onClick={() => navigate(`/user/event/${event.id}/hire`)}
                            variant="primary"
                        >
                            Hire Manager
                        </Button>
                    )}

                    {/* 2. Pay Now */}
                    {booking && booking.status === "ACCEPTED" && booking.payment_status !== "PAID" && (
                        <PayAdvanceButton bookingId={booking.id} />
                    )}

                    {/* 3. Final Payment */}
                    {booking && booking.status === "CONFIRMED" && eventEnded && (
                        <PayFinalButton bookingId={booking.id} />
                    )}

                    {/* 4. DOWNLOAD INVITATION & SHARE */}
                    {event.invitation_template_key && !eventEnded && (
                        <div className="mt-6 space-y-4">
                            <h4 className="font-semibold text-gray-700 border-b pb-2">Download & Share</h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button 
                                    onClick={() => handleDownloadInvitation("square")}
                                    disabled={downloading}
                                    variant="primary"
                                    className="bg-pink-600 hover:bg-pink-700" // Override for specific brand color
                                >
                                    Start Post (1:1)
                                </Button>
                                <Button 
                                    onClick={() => handleDownloadInvitation("story")}
                                    disabled={downloading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    Story / Status (9:16)
                                </Button>
                                <Button 
                                    onClick={() => handleDownloadInvitation("original")}
                                    disabled={downloading}
                                    variant="white"
                                >
                                    Original Card
                                </Button>
                                <Button 
                                    onClick={() => handleDownloadInvitation("print")}
                                    disabled={downloading}
                                    className="bg-blue-700 hover:bg-blue-800 text-white"
                                >
                                    HD Print (300 DPI)
                                </Button>
                            </div>
                            
                            {downloading && <p className="text-center text-sm text-purple-600 animate-pulse">Generating high-quality image...</p>}

                            {/* QR Code Section */}
                            <div className="mt-6 bg-gray-50 p-4 rounded border flex flex-col items-center text-center">
                                <p className="text-sm font-medium text-gray-600 mb-3">Scan to View Invitation</p>
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <QRCodeCanvas 
                                        value={`${window.location.origin}/user/event/${event.id}`} 
                                        size={128}
                                        level="M"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Share this QR code with guests</p>
                            </div>
                            
                            {/* Hidden Render Container */}
                            <div className="fixed left-[-9999px] top-0">
                                <div id="invitation-canvas">
                                    <InvitationCanvas scale={1}>
                                        <TemplateRenderer 
                                            htmlContent={event.template_details ? event.template_details.html_content : ""}
                                            data={event} 
                                        />
                                        {/* Optional: Branding watermark for higher ratios */}
                                        {exportConfig.name === 'story' && (
                                            <div className="absolute bottom-10 w-full text-center text-slate-400 text-2xl font-bold opacity-50">
                                                utsavora.com
                                            </div>
                                        )}
                                    </InvitationCanvas>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Event Memories</h3>
            
            {/* Upload UI - Only if allowed */}
            {event.can_upload_media && (
                <div className="mb-6 bg-purple-50 p-4 rounded border border-purple-100">
                    <h4 className="font-semibold text-purple-800 mb-2">Upload Photos</h4>
                    <p className="text-sm text-gray-600 mb-3">
                        Share your favorite moments! You can upload up to {event.upload_limit} photos.
                        (Allowed until {new Date(event.media_upload_deadline).toLocaleDateString()})
                    </p>
                    {/* Explicit Disable if limit reached */}
                    {media.length >= event.upload_limit ? (
                        <p className="text-red-600 font-bold text-sm">
                            Limit reached ({event.upload_limit} images). 
                            {event.upload_limit === 5 && " Hire a manager & pay to unlock 20 uploads."}
                        </p>
                    ) : (
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
                                    
                                    // Refresh media list specifically using the dedicated endpoint
                                    const res = await api.get(`/events/${id}/media/`);
                                    setMedia(res.data);
                                    
                                    // Also refresh event to update counts/limits if needed
                                    const eventRes = await api.get(`/events/${id}/`);
                                    setEvent(eventRes.data);
                                    
                                } catch (err) {
                                    console.error(err);
                                    toast.error(err.response?.data?.error || "Upload failed", { id: toastId });
                                }
                                e.target.value = null; // Reset input
                            }}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-purple-100 file:text-purple-700
                                hover:file:bg-purple-200
                            "
                        />
                    )}
                </div>
            )}

            {/* Gallery Grid */}
            <MediaGallery images={media} />
        </div>
      )}

      {activeTab === 'attendees' && (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmed Attendees</h3>
            {/* Adding key forces a fresh mount when event changes, resetting state automatically */}
            <PublicAttendeeList key={event.id} eventId={event.id} />
        </div>
      )}
    </div>
  );
}
