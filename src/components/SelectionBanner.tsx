import { X } from 'lucide-react';

interface SelectionBannerProps {
  count: number;
  onClear: () => void;
  /** what is being counted, e.g. "product" / "item" */
  noun?: string;
  className?: string;
}

const SelectionBanner = ({
  count,
  onClear,
  noun = 'item',
  className = ''
}: SelectionBannerProps) => {
  if (count === 0) return null;

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[#073c56]/5 border border-[#073c56]/20 ${className}`}
    >
      <span className="text-sm font-semibold text-[#073c56]">
        {count} {count === 1 ? noun : `${noun}s`} selected
      </span>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#073c56] text-white text-xs font-semibold hover:bg-[#062e42] transition"
      >
        <X size={12} />
        Clear
      </button>
    </div>
  );
};

export default SelectionBanner;
