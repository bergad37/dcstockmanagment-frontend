import React from 'react';
import CustomSelect from './SelectField';

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
  value: FilterOption | null;
  onChange: (value: FilterOption | null) => void;
}

interface FiltersProps {
  filters: Filter[];
}

const Filters: React.FC<FiltersProps> = ({ filters }) => {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col items-center">
          <CustomSelect
            id={filter.key}
            options={filter.options}
            value={filter.value}
            onChange={filter.onChange}
            placeholder={`Select ${filter.label.toLowerCase()}`}
            isClearable
          />
        </div>
      ))}
    </div>
  );
};

export default Filters;
