import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="py-4 border-b border-gray-100/60 last:border-none">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-0 group focus:outline-none"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 group-hover:text-gray-800 transition-colors">
          {title}
        </span>
        <ChevronDown size={14} className={`text-gray-400 group-hover:text-gray-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}