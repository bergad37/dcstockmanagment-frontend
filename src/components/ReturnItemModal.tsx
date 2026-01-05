import { useState } from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface ReturnItemPayload {
  returnDate: string;
  returnCondition: string;
}

interface ReturnItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ReturnItemPayload) => Promise<void>;
  productName: string;
}

const ReturnItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  productName
}: ReturnItemModalProps) => {
  const [returnDate, setReturnDate] = useState('');
  const [returnCondition, setReturnCondition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!returnDate || !returnCondition.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        returnDate,
        returnCondition
      });

      handleClose();
    } catch (error) {
      console.error('Error returning item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReturnDate('');
    setReturnCondition('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Return Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product
          </label>
          <p className="text-gray-900 font-medium">{productName}</p>
        </div>

        {/* Return Date */}
        <div>
          <label
            htmlFor="returnDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Return Date *
          </label>
          <input
            type="date"
            id="returnDate"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-[#073c56]"
            required
          />
        </div>

        {/* Return Condition */}
        <div>
          <label
            htmlFor="returnCondition"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Return Condition *
          </label>
          <textarea
            id="returnCondition"
            value={returnCondition}
            onChange={(e) => setReturnCondition(e.target.value)}
            placeholder="Describe the condition of the item..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-[#073c56]"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            label="Cancel"
            onClick={handleClose}
            bg="bg-gray-500"
            className="px-6"
          />
          <Button
            label={isSubmitting ? 'Processing...' : 'Return Item'}
            bg="bg-[#073c56]"
            className="px-6"
            disabled={isSubmitting || !returnDate || !returnCondition.trim()}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ReturnItemModal;
