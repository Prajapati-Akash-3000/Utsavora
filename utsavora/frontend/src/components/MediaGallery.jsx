import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
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
      {/* Grid (Masonry using CSS columns) */}
      <Motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         transition={{ duration: 0.5 }}
         className="columns-2 sm:columns-3 md:columns-4 gap-4 mt-4 space-y-4"
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group cursor-pointer bg-gray-100 rounded-lg overflow-hidden shadow-sm inline-block w-full"
            onClick={() => setActiveImage(img)}
          >
            <Motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.15 }}
              src={img.image}
              alt="event memory"
              className="w-full h-auto object-cover block"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-sm font-medium z-10 pointer-events-none">
              View
            </div>
          </div>
        ))}
      </Motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <Motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               transition={{ type: "spring", bounce: 0.25 }}
               className="relative max-w-5xl w-full flex flex-col items-center"
            >
              
              <button
                onClick={() => setActiveImage(null)}
                className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition focus:outline-none"
              >
                ×
              </button>

              <Motion.img
                src={activeImage.image}
                className="max-w-full max-h-[80vh] object-contain rounded shadow-md cursor-default"
                onClick={(e) => e.stopPropagation()} 
              />
              
              <div className="flex flex-col items-center mt-4 gap-2">
                  <a 
                     href={activeImage.image} 
                     download={`event_memory_${activeImage.id}.jpg`}
                     target="_blank" rel="noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                  >
                     ⬇ Download Image
                  </a>
                  <p className="text-gray-400 text-xs font-light tracking-wide">
                    Uploaded on{" "}
                    {new Date(activeImage.created_at || activeImage.uploaded_at).toLocaleDateString()}
                  </p>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
