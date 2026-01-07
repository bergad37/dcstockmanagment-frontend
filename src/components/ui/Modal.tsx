// components/Modal.jsx
import React from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  /** When false, hide the close button and prevent manual closing via the UI */
  closable?: boolean;
  /** Maximum height of the modal body in pixels */
  maxHeight?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closable = true,
  maxHeight
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Container */}
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Title + Close button (optional) */}
            <div className="flex items-center justify-between mb-4 ">
              <h2 className="text-xl font-semibold">{title}</h2>
              {closable && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-800 transition bg-background hover:bg-background/60"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div
              className="overflow-y-auto"
              style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
