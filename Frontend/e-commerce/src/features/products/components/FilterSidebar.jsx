import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import FilterSection from "./FilterSection";
import FilterItem from "./FilterItem";
import DiscountItem from "./DiscountItem";
import { CATEGORIES, GENDERS, DISCOUNTS, SUB_TYPES } from "./filterConfig";

export default function FilterSidebar({ filters, onChange, open, onClose, onClear }) {
  const { category, gender, type, sort, discount } = filters;

  const types = (() => {
    if (!category) return [];
    if (category === "beauty") return SUB_TYPES.beauty.product;
    if (gender) return SUB_TYPES[category]?.[gender] ?? [];
    return [];
  })();

  const skinConcerns = category === "beauty" ? SUB_TYPES.beauty.skinConcern : [];
  const hasActive = Object.values(filters).some(Boolean);

  function toggle(key, value) {
    onChange(key, filters[key] === value.toLowerCase() ? "" : value);
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 md:top-[72px] left-0 z-50  mt-20 md:mt-0
        h-full md:h-[calc(100vh-72px)] self-start
        w-[280px] md:w-[250px] lg:w-[260px] bg-white 
        border-r border-gray-100 flex flex-col 
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${open ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* Header */}
        <div className="flex items-center justify-between py-5 px-6 border-b border-gray-100/80 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={16} className="text-gray-900" />
            <span className="font-syne text-[15px] font-bold text-gray-900 tracking-wide uppercase">Filters</span>
          </div>
          <div className="flex items-center gap-3">
            {hasActive && (
              <button
                onClick={onClear}
                className="group flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-red-500 transition-colors uppercase tracking-wider"
                title="Clear all filters"
              >
                <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filters Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">

          <FilterSection title="Category">
            {CATEGORIES.map(c => (
              <FilterItem key={c} label={c} active={category === c} onClick={() => toggle("category", c)} />
            ))}
          </FilterSection>

          {category !== "beauty" && (
            <FilterSection title="Gender">
              {GENDERS.map(g => (
                <FilterItem key={g} label={g} active={gender === g} onClick={() => toggle("gender", g)} />
              ))}
            </FilterSection>
          )}

          {types.length > 0 && (
            <FilterSection title="Type">
              {types.map(t => (
                <FilterItem key={t} label={t} active={type === t.toLowerCase()} onClick={() => toggle("type", t)} />
              ))}
            </FilterSection>
          )}

          {skinConcerns.length > 0 && (
            <FilterSection title="Skin Concern">
              {skinConcerns.map(s => (
                <FilterItem key={s} label={s} active={type === s.toLowerCase()} onClick={() => toggle("type", s)} />
              ))}
            </FilterSection>
          )}

          <FilterSection title="Sort by Price">
            <FilterItem label="Low → High" active={sort === "priceLow"} onClick={() => toggle("price", "low")} />
            <FilterItem label="High → Low" active={sort === "priceHigh"} onClick={() => toggle("price", "high")} />
          </FilterSection>

          <FilterSection title="Discount" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
              {DISCOUNTS.map(d => (
                <DiscountItem key={d} label={`${d}%+`} active={discount === d} onClick={() => toggle("discount", d)} />
              ))}
            </div>
          </FilterSection>

        </div>
      </aside>
    </>
  );
}