import type { FormikHelpers } from 'formik';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import Modal from '../../components/ui/Modal';

export interface ReturnStockFormProps {
  handleClose: () => void;
  isOpen: boolean;
  transaction: {
    id: string;
    productName: string;
    productType: 'ITEM' | 'QUANTITY';
    quantity: number;
  };
}

interface FormValues {
  returnQuantity: number;
  returnDate: string;
}

const validationSchema = Yup.object({
  returnQuantity: Yup.number()
    .min(1, 'Quantity must be at least 1')
    .when('$productType', {
      is: 'QUANTITY',
      then: (schema) =>
        schema.max(
          Yup.ref('$maxQuantity'),
          'Return quantity cannot exceed rented quantity'
        ),
      otherwise: (schema) => schema.oneOf([1])
    }),
  returnDate: Yup.string().required('Return date is required')
});

const ReturnStockForm = ({
  handleClose,
  isOpen,
  transaction
}: ReturnStockFormProps) => {
  const initialValues: FormValues = {
    returnQuantity:
      transaction.productType === 'ITEM' ? 1 : transaction.quantity,
    returnDate: new Date().toISOString().split('T')[0]
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      // 🔁 Call your return API here
      console.log('RETURN PAYLOAD', {
        transactionId: transaction.id,
        ...values
      });

      toast.success('Item returned successfully');
      handleClose();
    } catch {
      toast.error('Failed to return item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Return Item">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validationContext={{
          productType: transaction.productType,
          maxQuantity: transaction.quantity
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Product
              </label>
              <input
                value={transaction.productName}
                disabled
                className="w-full rounded-xl px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700"
              />
            </div>

            {/* Return Quantity */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Return Quantity
              </label>
              <Field
                name="returnQuantity"
                type="number"
                min="1"
                disabled={transaction.productType === 'ITEM'}
                className="w-full rounded-xl px-3 py-2 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none disabled:bg-gray-100"
              />
              <ErrorMessage
                name="returnQuantity"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Return Date */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Return Date
              </label>
              <Field
                name="returnDate"
                type="date"
                className="w-full rounded-xl px-3 py-2 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="returnDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-200 rounded-full border border-gray-300 px-4 py-2 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-400 rounded-full text-white px-4 py-2 hover:bg-primary-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Returning...' : 'Confirm Return'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ReturnStockForm;
