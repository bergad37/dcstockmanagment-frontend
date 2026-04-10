import React, { useEffect, useState } from 'react';

type DeleteModalProps = {
  description?: string;
  onCancel: () => void;
  onConfirm: (comment?: string) => void;
  isOpen: boolean;
  loading?: boolean;
  requireComment?: boolean;
  commentLabel?: string;
};

const ConfirmModal: React.FC<DeleteModalProps> = ({
  description,
  onCancel,
  onConfirm,
  isOpen,
  loading,
  requireComment = false,
  commentLabel = 'Reason for deletion'
}) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (requireComment && !comment.trim()) {
      setError('Comment is required');
      return;
    }

    setError('');
    onConfirm(comment);
  };

  useEffect(() => {
    if (!isOpen) {
      setComment('');
      setError('');
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div
        className={`relative w-full max-w-md transform p-4 transition-transform duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="relative rounded-2xl bg-white p-6 text-center shadow-lg sm:p-6">
          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            className="absolute bg-[#ffff] right-3 top-3 rounded-lg p-1.5 text-gray-400 transition hover:bg-[#EAECF0]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Icon */}
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm text-gray-600 leading-relaxed">
            {description}
          </p>

          {/* COMMENT FIELD */}
          {requireComment && (
            <div className="mb-4 text-left">
              <label className="text-sm font-medium text-gray-700">
                {commentLabel} <span className="text-red-500">*</span>
              </label>

              <textarea
                className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition ${
                  error
                    ? 'border-red-500 focus:ring-1 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-1 focus:ring-gray-200'
                }`}
                placeholder="Enter reason..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="mt-1 flex justify-between">
                {error ? (
                  <p className="text-xs text-red-500">{error}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-400">
                  {comment.length}/200
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onCancel}
              className="w-24 rounded-full border border-brand-50 px-3 py-1.5 text-sm text-brand shadow-sm transition hover:bg-primary/90"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="flex w-24 items-center justify-center rounded-full bg-[#FF0000] px-3 py-1.5 text-sm text-white shadow-sm transition hover:bg-[#ff0000d1]"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
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
