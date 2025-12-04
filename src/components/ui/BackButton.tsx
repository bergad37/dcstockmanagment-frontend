import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  textClassName?: string;
  text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  className = '',
  textClassName = '',
  text = 'Back',
}) => {
  return (
    <div className={`my-3 flex items-center space-x-2 text-brand-500 ${className}`}>
      <button className="flex items-center" onClick={onClick}>
        <ArrowLeft className="text-2xl" />
        <p className={`text-normal font-semibold ${textClassName}`}>{text}</p>
      </button>
    </div>
  );
};

export default BackButton;
