import { useState } from "react";
import api from "../../../services/api";
import toast from "react-hot-toast";

export default function TemplateList({ templates, selectedTemplate, onSelect, onRefresh }) {
  const handleToggle = async (e, template) => {
    e.stopPropagation();
    try {
      await api.put(`/events/templates/${template.id}/toggle/`);
      onRefresh();
      toast.success(`Template ${template.is_active ? 'disabled' : 'enabled'}`);
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="font-bold text-gray-700">Templates</h2>
            <button 
                onClick={() => onSelect(null)}
                className="bg-purple-600 text-white px-3 py-1 text-sm rounded shadow hover:bg-purple-700 transition"
            >
                + New
            </button>
        </div>
        <div className="flex-1 overflow-y-auto">
            {templates.length === 0 && (
                <div className="p-4 text-center text-gray-400 text-sm">No templates found.</div>
            )}
            {templates.map(t => (
                <div 
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-center group transition ${
                        selectedTemplate?.id === t.id ? "bg-purple-50 border-purple-200" : ""
                    }`}
                >
                    <div className="overflow-hidden">
                        <p className="font-medium text-gray-800 truncate">{t.name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{t.category}</p>
                    </div>
                    <div className="flex items-center">
                         <button 
                            onClick={(e) => handleToggle(e, t)}
                            className={`w-3 h-3 rounded-full transition-transform hover:scale-125 ${t.is_active ? 'bg-green-500 shadow-green-200 shadow' : 'bg-gray-300'}`}
                            title={t.is_active ? "Active" : "Inactive"}
                         />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
