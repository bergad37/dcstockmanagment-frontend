// src/components/ui/CustomSelect.tsx

import Select, { type StylesConfig } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  options: Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  placeholder?: string;
  isClearable?: boolean;
}

const customStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    borderRadius: '0.75rem',
    padding: '2px',
    borderColor: state.isFocused ? '#073c56' : '#EAECF0',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(7,60,86,0.2)' : 'none',
    '&:hover': { borderColor: '#073c56' }
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '0.75rem',
    overflow: 'hidden',
    zIndex: 9999
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#073c56'
      : state.isFocused
      ? '#073c5620'
      : 'white',
    color: state.isSelected ? 'white' : '#111827',
    padding: '10px 12px',
    cursor: 'pointer'
  })
};

export default function CustomSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isClearable = false
}: CustomSelectProps) {
  return (
    <Select
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isClearable={isClearable}
      menuPortalTarget={document.body}
      className="react-select-container"
      classNamePrefix="react-select"
      styles={customStyles}
    />
  );
}
