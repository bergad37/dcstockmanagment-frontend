type DateRangeFilterProps = {
  from: string | null;
  to: string | null;
  onFromChange: (value: string | null) => void;
  onToChange: (value: string | null) => void;
};

const DateRangeFilter = ({
  from,
  to,
  onFromChange,
  onToChange
}: DateRangeFilterProps) => {
  return (
    <div className="flex gap-1 items-end">
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">From</label>
        <input
          type="date"
          value={from ?? ''}
          onChange={(e) => onFromChange(e.target.value || null)}
          className="border rounded-xl px-2 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">To</label>
        <input
          type="date"
          value={to ?? ''}
          onChange={(e) => onToChange(e.target.value || null)}
          className="border rounded-xl px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
