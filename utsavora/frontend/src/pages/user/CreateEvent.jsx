import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import TemplateRenderer from "../../invitations/TemplateRenderer";
import AutoFitInvitationCanvas from "../../invitations/AutoFitInvitationCanvas";

export default function CreateEvent() {
  const navigate = useNavigate();
  // Basic Event Data
  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    venue: "",
    city: "",
    contact_numbers: "",
    description: "",
    is_public: true, // Legacy, kept for compatibility but UI uses 'visibility' now
    visibility: "PRIVATE",
    pricing_type: "FREE",
    registration_fee: "",
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Valid template object
  const [templates, setTemplates] = useState([]);
  const [fetchingTemplates, setFetchingTemplates] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch dynamic templates
  useEffect(() => {
    setFetchingTemplates(true);
    api.get("/events/templates/")
      .then(res => {
          setTemplates(res.data);
          if (res.data.length > 0) {
              setSelectedTemplate(res.data[0]);
          }
      })
      .catch(err => {
          console.error("Failed to load templates", err);
      })
      .finally(() => setFetchingTemplates(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedTemplate) {
          toast.error("Please select a template");
          setLoading(false);
          return;
      }

      const payload = {
        ...formData,
        template_id: selectedTemplate.id,
        // Legacy support if needed, or remove
        invitation_template_key: selectedTemplate.template_key
      };
      
      const response = await api.post("/events/create/", payload);
      toast.success("Event created directly! 🎨");
      navigate(`/user/event/${response.data.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Create New Event</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          {/* Left Column: Form */}
          <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Event Details</h3>
                <form id="create-event-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                    <label className="block text-gray-700 font-medium mb-1">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="e.g. Ananya & Vikram's Wedding"
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                required
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.start_date}
                                onChange={handleChange}
                            />
                        </div>
                         <div>
                            <label className="block text-gray-700 font-medium mb-1">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                required
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.end_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-gray-700 font-medium mb-1">Venue Name</label>
                            <input
                                type="text"
                                name="venue"
                                required
                                placeholder="e.g. The Grand Palace"
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.venue}
                                onChange={handleChange}
                            />
                        </div>
                         <div>
                            <label className="block text-gray-700 font-medium mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                required
                                placeholder="e.g. Udaipur"
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Contact Numbers</label>
                        <input
                            type="text"
                            name="contact_numbers"
                            placeholder="e.g. +91 9876543210, +91 1234567890"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.contact_numbers}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="2"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Visibility & Pricing Section */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-medium text-gray-700 mb-3">Event Settings</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Visibility</label>
                                <select
                                    name="visibility"
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={formData.visibility || 'PRIVATE'}
                                    onChange={handleChange}
                                >
                                    <option value="PRIVATE">Private (Invite Only)</option>
                                    <option value="PUBLIC">Public</option>
                                </select>
                            </div>

                            {formData.visibility === 'PUBLIC' && (
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Pricing</label>
                                    <select
                                        name="pricing_type"
                                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={formData.pricing_type || 'FREE'}
                                        onChange={handleChange}
                                    >
                                        <option value="FREE">Free</option>
                                        <option value="PAID">Paid</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {formData.visibility === 'PUBLIC' && formData.pricing_type === 'PAID' && (
                            <div className="mt-4">
                                <label className="block text-gray-700 font-medium mb-1">Registration Fee (₹)</label>
                                <input
                                    type="number"
                                    name="registration_fee"
                                    min="1"
                                    required
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={formData.registration_fee || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>
                </form>
              </div>

              {/* Template Selector Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-purple-700">Choose a Design</h3>
                  
                  {fetchingTemplates && <div className="text-sm text-purple-600 mb-2">Loading templates...</div>}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {templates.map(t => (
                          <div 
                            key={t.id}
                            onClick={() => setSelectedTemplate(t)}
                            className={`cursor-pointer border-2 rounded-lg p-2 transition-all hover:shadow-md ${
                                selectedTemplate && selectedTemplate.id === t.id ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 bg-white'
                            }`}
                          >
                              {t.preview_image ? (
                                <div className="aspect-[2/3] w-full bg-gray-100 rounded mb-2 overflow-hidden">
                                    <img src={t.preview_image} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="aspect-[2/3] w-full bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400 text-xs">
                                    No Preview
                                </div>
                              )}
                              <p className="text-center text-sm font-medium text-gray-700 truncate">{t.name}</p>
                              <p className="text-center text-xs text-gray-500 uppercase tracking-wider">{t.category}</p>
                          </div>
                      ))}
                      
                      {templates.length === 0 && !fetchingTemplates && (
                          <div className="text-gray-500 col-span-3 text-center py-4">
                              No templates found. Please check Admin.
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* Right Column: Preview + Actions */}
          <div className="lg:sticky lg:top-10 h-fit space-y-6 flex flex-col items-center">
               <h3 className="text-xl font-semibold text-gray-700 w-full text-left">Live Preview</h3>
               


               <div className="w-full h-[600px] flex justify-center"> {/* Fixed height container for auto-fit */}
                    <AutoFitInvitationCanvas>
                        <TemplateRenderer 
                            htmlContent={selectedTemplate?.html_content}
                            data={{
                                title: formData.title,
                                event_title: formData.title, // Alias
                                event_name: formData.title, // Alias for some templates
                                
                                venue: formData.venue,
                                location: formData.venue, // Alias
                                
                                city: formData.city,
                                start_date: formData.start_date,
                                end_date: formData.end_date,
                                description: formData.description,
                                
                                // Host isn't in form, mapping to title for safe fallback
                                host: formData.title,

                                // Split contacts for granular template support
                                contact1: formData.contact_numbers?.split(',')[0]?.trim() || "",
                                contact2: formData.contact_numbers?.split(',')[1]?.trim() || "",
                                contact_numbers: formData.contact_numbers
                            }} 
                        />
                    </AutoFitInvitationCanvas>
               </div>

               <button
                type="submit"
                form="create-event-form"
                disabled={loading}
                className="w-full bg-purple-600 text-white font-bold py-3 text-lg rounded-lg hover:bg-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
               >
                {loading ? "Creating..." : "Create Event & Save Invitation"}
               </button>
               
               <p className="text-sm text-gray-500 text-center">
                   * You can download this later from the event page.
               </p>
          </div>
      </div>
    </div>
  );
}
