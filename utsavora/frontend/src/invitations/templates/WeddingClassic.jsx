import React from 'react';

// A classic, elegant wedding invitation template
const WeddingClassic = ({ data }) => {
    // Determine background color based on logic or default
    const bgColor = "bg-rose-50"; 
    
    return (
        <div 
            className={`w-[400px] h-[600px] ${bgColor} p-8 flex flex-col items-center justify-between text-center border-4 border-double border-rose-200 shadow-xl font-serif text-gray-800`}
            style={{ fontFamily: 'Georgia, serif' }} // Inline font stack for consistency in canvas
        >
            <div className="w-full text-center mt-6">
                <span className="text-xl uppercase tracking-widest text-rose-800">Together with their families</span>
            </div>

            <div className="flex flex-col gap-2 my-auto">
                <h1 className="text-4xl italic font-bold text-rose-900">{data.female_host || data.host?.split('&')[0] || "Bride"}</h1>
                <span className="text-2xl text-rose-400">&</span>
                <h1 className="text-4xl italic font-bold text-rose-900">{data.male_host || data.host?.split('&')[1] || "Groom"}</h1>
                
                <p className="mt-6 text-lg tracking-wide">Invite you to celebrate their wedding</p>
            </div>

            <div className="mb-10 w-full space-y-2">
                <div className="border-t border-b border-rose-300 py-4">
                    <p className="text-xl font-bold text-rose-900 mb-1">
                        {data.start_date || "Start Date"} – {data.end_date || "End Date"}
                    </p>
                </div>
                
                <div className="pt-4">
                     <p className="text-lg font-semibold">{data.venue || "Venue Name"}</p>
                </div>
            </div>
            
            <div className="text-sm text-rose-500">
               {(data.contact1 || data.contact2) && (
                   <div className="mt-2">
                       <p className="font-semibold uppercase tracking-widest text-xs">RSVP & Contact</p>
                       {data.contact1 && <p>{data.contact1}</p>}
                       {data.contact2 && <p>{data.contact2}</p>}
                   </div>
               )}
            </div>
        </div>
    );
};

export default WeddingClassic;
