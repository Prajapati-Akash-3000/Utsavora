import React from "react";

const TemplateSelector = ({ templates, selected, onSelect }) => {
  return (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select Invitation Template</label>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x">
            {templates.map(t => (
            <div
                key={t.id}
                onClick={() => onSelect(t)}
                className={`relative cursor-pointer rounded-lg border-2 flex-shrink-0 snap-center transition-all
                ${selected?.id === t.id ? "border-purple-600 scale-105 shadow-md" : "border-gray-200 hover:border-purple-300"}
                `}
            >
                {t.preview_image ? (
                    <img src={t.preview_image} alt={t.name} className="w-36 h-52 object-cover rounded" />
                ) : (
                    <div className="w-36 h-52 bg-gray-100 flex items-center justify-center rounded text-gray-400">
                        No Preview
                    </div>
                )}
                <div className="bg-white p-2 text-center rounded-b-md">
                    <p className="text-xs font-semibold text-gray-700 truncate w-32 mx-auto">{t.name}</p>
                </div>
                
                {selected?.id === t.id && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                )}
            </div>
            ))}
            
            {templates.length === 0 && (
                <div className="text-gray-500 text-sm italic p-4">No templates available.</div>
            )}
        </div>
    </div>
  );
};

export default TemplateSelector;
