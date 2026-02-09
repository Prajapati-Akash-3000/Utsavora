import React from "react";

const InvitationPreview = ({ template, data, isPlaceholder = false }) => {
  if (!template && !isPlaceholder) return null;

  // Placeholder mode logic
  if (isPlaceholder || !template) {
       return (
           <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
               <p>Select a template to preview</p>
           </div>
       );
  }

  return (
    <div
      className="relative w-full aspect-[0.7] bg-cover bg-center bg-no-repeat shadow-lg rounded-lg overflow-hidden transition-all duration-500"
      style={{ 
          backgroundImage: template.background_image ? `url(${template.background_image})` : 'none',
          backgroundColor: '#fff'
      }}
    >
      <div className="w-full h-full bg-black/10 flex flex-col items-center justify-center p-6 text-center">
          
          {/* Title */}
          <h1 className="text-3xl font-serif text-gray-900 mb-6 drop-shadow-sm font-bold opacity-90">
             {data.title || "Event Title"}
          </h1>

          {/* Date */}
          <p className="text-lg font-medium text-gray-800 mb-2 drop-shadow-sm">
            {data.start_date || "Date"} 
            {data.end_date && data.end_date !== data.start_date ? ` - ${data.end_date}` : ""}
          </p>

          {/* Venue & City */}
          <div className="mb-6">
              <p className="text-base text-gray-800 font-semibold">{data.venue || "Venue Name"}</p>
              <p className="text-sm text-gray-700">{data.city || "City"}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 italic max-w-xs leading-relaxed">
             {data.description || "Join us for a celebration..."}
          </p>

      </div>
    </div>
  );
};

export default InvitationPreview;
