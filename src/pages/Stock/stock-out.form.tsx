import type { FormikHelpers } from 'formik';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
// import { useProductStore } from '../../store/productStore';
import { useStockStore } from '../../store/stockStore';
import { useCustomerStore } from '../../store/CustomerStore';
import { useEffect } from 'react';

interface StockOutFormProps {
  handleClose: () => void;
  product: { label: string; value: string; type: 'ITEM' | 'QUANTITY' } | null;
}

interface FormValues {
  productId: string;
  type: 'SOLD' | 'RENTED';
  clientName: string;
  clientEmail: string;
  quantity: string;
  transactionDate: string;
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
  transactionDate: Yup.string().required('Transaction date is required'),
  returnDate: Yup.string().when('type', {
    is: 'RENTED',
    then: (schema) =>
      schema.required('Return date is required for rented items'),
    otherwise: (schema) => schema.notRequired()
  })
});

const StockOutForm = ({ handleClose, product }: StockOutFormProps) => {
  const { stock, fetchStock } = useStockStore();
  const { customers, fetchCustomer } = useCustomerStore();

  //   console.log('use real products from backend', products);
  const { recordStockOut } = useStockStore();

  useEffect(() => {
    fetchStock();
    fetchCustomer();
  }, [fetchStock, fetchCustomer]);

  const initialValues: FormValues = {
    productId: product?.value || '',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: product?.type === 'ITEM' ? '1' : '',
    transactionDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    returnDate: ''
  };

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
        transactionDate: values.transactionDate,
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
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Product Selection */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Product <span className="text-red-500">*</span>
              </label>
              <Field
                name="productId"
                as="select"
                disabled={!!product}
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a product...</option>
                {stock?.stocks.map((item) => (
                  <option key={item.product.id} value={item.product.id}>
                    {item.product.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="productId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
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
              </div>{' '}
            </div>

            {/* Client Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Client <span className="text-red-500">*</span>
              </label>
              <Field
                name="clientName"
                as="select"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedName = e.target.value;
                  setFieldValue('clientName', selectedName);
                  const selectedClient = customers.find(
                    (c) => c.name === selectedName
                  );
                  if (selectedClient) {
                    setFieldValue('clientEmail', selectedClient.email);
                  } else {
                    setFieldValue('clientEmail', '');
                  }
                }}
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              >
                <option value="">Select a client...</option>
                {customers.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </Field>
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
                disabled
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                disabled={product?.type === 'ITEM'}
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Transaction Date */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Transaction Date <span className="text-red-500">*</span>
              </label>
              <Field
                name="transactionDate"
                type="date"
                className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="transactionDate"
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
