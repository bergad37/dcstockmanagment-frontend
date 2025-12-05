import React from 'react';

interface Action<T> {
  icon: React.ReactNode;
  handler: (row: T) => void;
  label?: string;
}

interface ActionButtonsProps<T> {
  row: T;
  actions: Action<T>[];
}

export const ActionButtons = <T,>({ row, actions }: ActionButtonsProps<T>) => {
  return (
    <div className='flex flex-row space-x-2'>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => action.handler(row)}
          className='bg-white cursor-pointer rounded-full p-2 transition-all duration-300 hover:scale-110 hover:bg-[#EAECF0]'
          aria-label={action.label || 'Action'}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};
