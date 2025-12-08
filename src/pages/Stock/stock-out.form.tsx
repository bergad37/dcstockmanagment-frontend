import type { FormikHelpers } from 'formik';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useProductStore } from '../../store/productStore';
import { useStockStore } from '../../store/stockStore';

interface StockOutFormProps {
  handleClose: () => void;
}

interface FormValues {
  productId: string;
  type: 'SOLD' | 'RENTED';
  clientName: string;
  clientEmail: string;
  quantity: string;
  returnDate: string;
}

const validationSchema = Yup.object().shape({
  productId: Yup.string().required('Product is required'),
  type: Yup.string()
    .oneOf(['SOLD', 'RENTED'])
    .required('Transaction type is required'),
  clientName: Yup.string()
    .min(2, 'Client name must be at least 2 characters')
    .required('Client name is required'),
  clientEmail: Yup.string()
    .email('Invalid email address')
    .required('Client email is required'),
  quantity: Yup.number()
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  returnDate: Yup.string().when('type', {
    is: 'RENTED',
    then: (schema) =>
      schema.required('Return date is required for rented items'),
    otherwise: (schema) => schema.notRequired()
  })
});

const StockOutForm = ({ handleClose }: StockOutFormProps) => {
  let { products } = useProductStore();

  console.log('use real products from backend', products);
  const { recordStockOut } = useStockStore();

  const initialValues: FormValues = {
    productId: '',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: '',
    returnDate: ''
  };
  const dummyProducts = [{ name: 'Laptop', id: '123456' }];

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const payload = {
        productId: values.productId,
        type: values.type,
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        quantity: parseInt(values.quantity),
        ...(values.type === 'RENTED' && { returnDate: values.returnDate })
      };

      await recordStockOut(payload);
      toast.success(
        values.type === 'SOLD'
          ? 'Item sold successfully!'
          : 'Item rented successfully!'
      );
      handleClose();
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      const errorData = (err?.response as Record<string, unknown>)
        ?.data as Record<string, unknown>;
      toast.error(
        (errorData?.message as string) || 'Failed to record stock out'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-4 p-6 max-w-md bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#073c56' }}>
        Record Stock Out
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            {/* Product Selection */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Product <span className="text-red-500">*</span>
              </label>
              <Field
                name="productId"
                as="select"
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              >
                <option value="">Select a product...</option>
                {dummyProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="productId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Transaction Type <span className="text-red-500">*</span>
              </label>
              <Field
                name="type"
                as="select"
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              >
                <option value="">Select transaction type...</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Client Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Client Name <span className="text-red-500">*</span>
              </label>
              <Field
                name="clientName"
                placeholder="Enter client name"
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="clientName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Client Email */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Client Email <span className="text-red-500">*</span>
              </label>
              <Field
                name="clientEmail"
                type="email"
                placeholder="client@example.com"
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="clientEmail"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </label>
              <Field
                name="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Return Date (only for rented items) */}
            {values.type === 'RENTED' && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Expected Return Date <span className="text-red-500">*</span>
                </label>
                <Field
                  name="returnDate"
                  type="date"
                  className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                />
                <ErrorMessage
                  name="returnDate"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-200 rounded-full border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#073c56] rounded-full text-white px-4 py-2 hover:bg-[#055082] transition disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Recording...'
                  : values.type === 'SOLD'
                  ? 'Record Sale'
                  : 'Record Rental'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StockOutForm;
