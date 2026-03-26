import { useState, useEffect } from "react";
import api from "../../../services/api";
import InvitationStage from "../../../invitations/engine/InvitationStage";
import InvitationRenderer from "../../../invitations/engine/InvitationRenderer";
import toast from "react-hot-toast";

const PLACEHOLDERS = [
    "title", "venue", "city", "start_date", "end_date", 
    "host", "contact1", "contact2", "description"
];

const PREVIEW_DATA = {
    title: "Ananya & Vikram",
    event_title: "Ananya & Vikram",
    event_name: "Ananya & Vikram",
    host: "Sharma Family",
    start_date: "2026-10-24",
    end_date: "2026-10-26",
    venue: "The Grand Palace",
    location: "The Grand Palace",
    city: "Udaipur",
    contact_numbers: "+91 9876543210, +91 9123456789",
    contact1: "+91 9876543210", 
    contact2: "+91 9123456789",
    description: "Join us for the celebration of love!",
};

export default function TemplateEditor({ template, onSaveSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    template_key: "",
    category: "wedding",
    html_content: "",
    is_active: true
  });

  // Initialize form when template changes
  useEffect(() => {
    if (template) {
        setFormData({
            name: template.name,
            template_key: template.template_key,
            category: template.category,
            html_content: template.html_content,
            is_active: template.is_active
        });
    } else {
        // Reset for new template
        setFormData({
            name: "",
            template_key: "",
            category: "wedding",
            html_content: "<!-- Template HTML -->\n<div class='text-center p-10 bg-white'>\n  <h1 class='text-3xl text-purple-700'>{{title}}</h1>\n  <p>{{start_date}}</p>\n</div>",
            is_active: true
        });
    }
  }, [template]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const insertPlaceholder = (ph) => {
      const tag = `{{${ph}}}`;
      setFormData(prev => ({
          ...prev,
          html_content: prev.html_content + tag
      }));
      toast.success(`Inserted ${tag}`);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.template_key || !formData.html_content) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (template) {
        await api.put(`/events/templates/${template.id}/update/`, formData);
        toast.success("Template updated!");
      } else {
        await api.post("/events/templates/create/", formData);
        toast.success("Template created!");
      }
      onSaveSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-3/4 flex flex-col h-full overflow-hidden bg-gray-50">
        
        {/* Top Bar */}
        <div className="bg-white border-b p-4 flex gap-4 items-center shadow-sm z-10">
             <div className="flex-1 flex gap-4">
                <input
                    className="border border-gray-300 p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-purple-500 outline-none text-sm transition duration-200"
                    placeholder="Template Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    className="border border-gray-300 p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-purple-500 outline-none text-sm transition duration-200"
                    placeholder="Key (slug)"
                    name="template_key"
                    value={formData.template_key}
                    onChange={handleChange}
                />
                <select
                    className="border border-gray-300 p-2 rounded-lg w-1/4 bg-white focus:ring-2 focus:ring-purple-500 outline-none text-sm transition duration-200"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="engagement">Engagement</option>
                    <option value="corporate">Corporate</option>
                    <option value="other">Other</option>
                </select>
             </div>

             <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                </label>

                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-purple-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-purple-700 disabled:opacity-50 transition duration-200 shadow-sm hover:shadow-lg active:scale-95"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
             </div>
        </div>

        {/* Work Area */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Editor Input */}
            <div className="w-1/2 flex flex-col border-r bg-white">
                <div className="border-b p-2 bg-gray-50 flex gap-2 overflow-x-auto">
                    {PLACEHOLDERS.map(ph => (
                        <button
                            key={ph}
                            onClick={() => insertPlaceholder(ph)}
                            className="text-xs bg-white border border-gray-300 px-2 py-1 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition duration-200 text-gray-600 whitespace-nowrap"
                        >
                            {`{{${ph}}}`}
                        </button>
                    ))}
                </div>
                <textarea
                    className="flex-1 w-full p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                    placeholder="Enter HTML here..."
                    name="html_content"
                    value={formData.html_content}
                    onChange={handleChange}
                />
            </div>

            {/* Live Preview */}
            <div className="w-1/2 bg-gray-200 flex flex-col overflow-hidden relative">
                 <div className="flex-1 overflow-hidden p-4 sm:p-8 bg-gray-300"> 
                    <div className="w-full max-w-[400px] h-[500px] sm:h-[600px] mx-auto shadow-2xl rounded-2xl overflow-hidden">
                        <InvitationStage>
                            <InvitationRenderer 
                                htmlContent={formData.html_content}
                                data={PREVIEW_DATA}
                                eventLink="https://utsavora.com/event-demo"
                            />
                        </InvitationStage>
                    </div>
                 </div>
            </div>

        </div>

    </div>
  );
}
