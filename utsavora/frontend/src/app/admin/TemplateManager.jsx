import { useState, useEffect } from "react";
import api from "../../services/api";
import TemplateList from "./templates/TemplateList";
import TemplateEditor from "./templates/TemplateEditor";

export default function TemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    api.get("/events/templates/all/")
      .then(res => setTemplates(res.data))
      .catch(err => console.error("Failed to load templates", err));
  };

  const handleSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleRefresh = () => {
      fetchTemplates();
  };

  const handleSaveSuccess = () => {
      fetchTemplates();
      // Optionally keep selected or clear? clearer to keep editing or select new
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gray-100">
      <TemplateList 
        templates={templates} 
        selectedTemplate={selectedTemplate} 
        onSelect={handleSelect} 
        onRefresh={handleRefresh}
      />
      <TemplateEditor 
        template={selectedTemplate} 
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
