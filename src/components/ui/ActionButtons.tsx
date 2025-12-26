import React from 'react';

interface Action<T> {
  icon: React.ReactNode;
  handler: (row: T) => void;
  label?: string;
  plain?: boolean;
}

interface ActionButtonsProps<T> {
  row: T;
  actions: Action<T>[];
  disabled?: boolean;
}
export const ActionButtons = <T,>({ row, actions, disabled = false }: ActionButtonsProps<T>) => {
  return (
    <div className="flex flex-row space-x-2">
      {actions.map((action, index) => {
        const base = 'cursor-pointer transition-all duration-300 hover:scale-110';
        const plainClass = 'bg-transparent p-0 rounded-none hover:bg-transparent text-[#475467]';
        const fancyClass = 'bg-white rounded-full p-2 hover:bg-[#EAECF0]';

        return (
          <button
            key={index}
            onClick={() => action.handler(row)}
            className={`${base} ${action.plain ? plainClass : fancyClass} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            aria-label={action.label || 'Action'}
            disabled={disabled}
          >
            {action.icon}
          </button>
        );
      })}
    </div>
  );
};
