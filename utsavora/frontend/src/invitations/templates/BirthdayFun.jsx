import React from 'react';

// A playful, colorful birthday invitation template
const BirthdayFun = ({ data }) => {
    return (
        <div 
            className="w-[400px] h-[600px] bg-yellow-100 p-8 flex flex-col items-center justify-center text-center border-8 border-dashed border-blue-400 shadow-xl font-sans text-gray-800 relative overflow-hidden"
            style={{ fontFamily: 'Verdana, sans-serif' }}
        >
            {/* Decorative circles */}
            <div className="absolute top-[-50px] left-[-50px] w-32 h-32 rounded-full bg-purple-300 opacity-50"></div>
            <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 rounded-full bg-pink-300 opacity-50"></div>

            <div className="z-10 bg-white bg-opacity-80 p-6 rounded-xl shadow-sm w-full h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-blue-500 tracking-wider uppercase mb-2">It's a Party!</h3>
                    <h1 className="text-5xl font-extrabold text-purple-600 leading-tight">
                        {data.host || "Someone"}'s<br/>Birthday
                    </h1>
                </div>

                <div className="my-6 space-y-4">
                    <div className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full inline-block font-bold text-xl transform -rotate-2">
                        {data.age ? `Turning ${data.age}!` : "Celebration!"}
                    </div>
                    
                    <p className="text-lg text-gray-700 font-medium px-4">
                        {data.message || "Join us for cake, games, and lots of fun!"}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="font-bold text-blue-800 text-lg">
                            {data.start_date || "Start"} — {data.end_date || "End"}
                        </p>
                    </div>

                    <div>
                         <p className="font-bold text-gray-800 text-lg">{data.venue || "Location"}</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-sm font-bold text-gray-500">
                    {(data.contact1 || data.contact2) && (
                       <div>
                           <p>Call for details:</p>
                           {data.contact1 && <p>{data.contact1}</p>}
                           {data.contact2 && <p>{data.contact2}</p>}
                       </div>
                   )}
                </div>
            </div>
        </div>
    );
};

export default BirthdayFun;
