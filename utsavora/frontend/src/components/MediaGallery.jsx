import { useState } from "react";
import EmptyState from "./ui/EmptyState";

export default function MediaGallery({ images }) {
  const [activeImage, setActiveImage] = useState(null);

  if (!images || images.length === 0) {
    return (
      <EmptyState 
        title="No memories yet"
        message="Upload photos to create your event gallery."
        icon="media"
        className="mt-4 border-dashed border-gray-200 bg-gray-50"
      />
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group cursor-pointer aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm"
            onClick={() => setActiveImage(img)}
          >
            <img
              src={img.image}
              alt="event memory"
              className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-medium">
              View
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition"
            >
              ×
            </button>

            <img
              src={activeImage.image}
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
            
            <p className="text-gray-400 text-sm mt-4 font-light">
              Uploaded on{" "}
              {new Date(activeImage.created_at || activeImage.uploaded_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
