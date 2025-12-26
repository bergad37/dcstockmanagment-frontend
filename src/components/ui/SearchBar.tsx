import { X } from 'lucide-react';
import React, { useState } from 'react';
// import '../styles/responsiveness/styles.css';

interface SearchBarProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSubmit,
  onChange
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange?.(value);

    if (value.trim() === '') {
      onSubmit('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit(inputValue);
    }
  };

  const handleSearchClick = () => {
    onSubmit(inputValue);
  };

  const handleClearClick = () => {
    setInputValue('');
    onSubmit('');
  };

  return (
    <div className="tablet-width mx-2 flex h-[42px] w-full items-center justify-between overflow-hidden rounded-xl border-[1px] border-slate-300 px-4 py-3 font-[sans-serif] shadow-xl shadow-slate-100 sm:w-72">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="w-full bg-transparent text-sm font-light leading-6 text-[#475467] outline-none"
      />
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-slate-100 p-1 hover:bg-slate-200">
          <X
            className="cursor-pointer text-[#667085]"
            onClick={handleClearClick}
          />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192.904 192.904"
          width="20px"
          height="20px"
          className="cursor-pointer fill-[#667085]"
          onClick={handleSearchClick}
        >
          <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
