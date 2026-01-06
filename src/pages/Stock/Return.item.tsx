import type { FormikHelpers } from 'formik';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import Modal from '../../components/ui/Modal';
import { useStockStore } from '../../store/stockStore';
import type { StockOutPayload } from '../../api/stockApi';

export interface ReturnStockFormProps {
  handleClose: () => void;
  isOpen: boolean;
  transaction: {
    id: string;
    productName: string;
    productType: 'ITEM' | 'QUANTITY';
    quantity: number;
    productId: string;
  };
}

interface FormValues {
  returnQuantity: number;
  returnDate: string;
  returnCondition: string;
}

const validationSchema = Yup.object({
  returnQuantity: Yup.number()
    .required('Return quantity is required')
    .min(1, 'Quantity must be at least 1')
    .when('$productType', {
      is: 'QUANTITY',
      then: (schema) =>
        schema.max(
          Yup.ref('$maxQuantity'),
          'Return quantity cannot exceed rented quantity'
        ),
      otherwise: (schema) => schema.default(1)
    }),

  returnDate: Yup.string().required('Return date is required'),

  returnCondition: Yup.string()
    .trim()
    .min(5, 'Please provide more details')
    .required('Return condition is required')
});

const ReturnStockForm = ({
  handleClose,
  isOpen,
  transaction
}: ReturnStockFormProps) => {
  const initialValues: FormValues = {
    returnQuantity:
      transaction.productType === 'ITEM' ? 1 : transaction.quantity,
    returnDate: new Date().toISOString().split('T')[0],
    returnCondition: ''
  };

  const { markAsReturned, fetchAllTransaction } =
    useStockStore();
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      // 🔁 Call your return API here

      await markAsReturned(
        {
          quantity: values.returnQuantity,
          productId: transaction?.productId,
          returnDate: values.returnDate
        } as StockOutPayload,
        transaction?.id
      );

        fetchAllTransaction();
        toast.success('Item returned successfully');
        resetForm();
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

            {/* Return Condition */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Return Condition
              </label>
              <Field
                as="textarea"
                name="returnCondition"
                rows={3}
                placeholder="Describe the condition of the returned item..."
                className="w-full rounded-xl px-3 py-2 border border-[#073c56]/40
      focus:border-[#073c56] focus:outline-none resize-none"
              />
              <ErrorMessage
                name="returnCondition"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray rounded-full border border-gray-300 px-4 py-2 hover:bg-gray-300 transition"
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
