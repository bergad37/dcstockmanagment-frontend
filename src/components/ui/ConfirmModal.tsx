import React from 'react';

type DeleteModalProps = {
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isOpen: boolean;
  loading?: boolean;
};

const ConfirmModal: React.FC<DeleteModalProps> = ({
  description,
  onCancel,
  onConfirm,
  isOpen,
  loading
}) => {
  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
    >
      <div
        className={`relative h-auto w-full max-w-md transform p-4 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'
          }`}
      >
        <div className=' relative rounded-2xl bg-white p-4 text-center shadow sm:p-5'>
          <button
            type='button'
            onClick={onCancel}
            className='text-gray-400 absolute right-2.5 top-2.5 rounded-lg bg-transparent p-1.5 text-sm hover:bg-[#EAECF0]'
          >
            <svg
              aria-hidden='true'
              className='h-5 w-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              ></path>
            </svg>
            <span className='sr-only'>Close modal</span>
          </button>
          <svg
            className='m-3.5 mx-auto h-11 w-11 text-gray'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
              clipRule='evenodd'
            ></path>
          </svg>
          <p className='text-gray-500 mb-4 text-brand-300'>{description}</p>
          <div className='flex items-center justify-center space-x-4'>
            <button
              onClick={onCancel}
              className='w-1/4 rounded-full border border-brand-50 bg-none p-1 text-brand shadow-2xl transition duration-300 ease-in-out hover:bg-primary/90'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className='flex w-1/4 justify-center rounded-full bg-[#FF0000] p-1 text-white shadow-2xl transition duration-300 ease-in-out hover:bg-[#ff0000d1]'
            >
              {loading ? (
                <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-current' />
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
