const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group cursor-pointer w-full h-full">
      {children}

      <div className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        hidden group-hover:block
        bg-black text-white text-xs rounded px-2 py-1
        whitespace-nowrap z-50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
      ">
        {text}
        {/* Triangle arrow */}
        <div className="absolute top-100 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
};

export default Tooltip;
