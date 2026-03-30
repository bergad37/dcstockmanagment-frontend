import type { FormikHelpers } from 'formik';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
// import { useProductStore } from '../../store/productStore';
import { useStockStore } from '../../store/stockStore';
import { useCustomerStore } from '../../store/CustomerStore';
import { useEffect } from 'react';
import Select from 'react-select';

interface StockOutFormProps {
  handleClose: () => void;
  product: {
    label: string;
    value: string;
    type: 'ITEM' | 'QUANTITY' | 'CALIBRATION';
  } | null;
}

interface FormValues {
  customerId?: string;
  customerName?: string;
  type: 'SOLD' | 'RENTED' | 'MAINTAINED' | 'NOT_MAINTAINED';
  transactionDate: string;
  returnDate?: string;
  items: {
    productId: string;
    quantity: string;
  }[];
}

const validationSchema = Yup.object({
  customerId: Yup.string().nullable(),
  customerName: Yup.string().nullable(),

  type: Yup.string()
    .oneOf(['SOLD', 'RENTED', 'MAINTAINED', 'NOT_MAINTAINED'])
    .required(),
  transactionDate: Yup.string().required(),

  returnDate: Yup.string().when('type', {
    is: 'RENTED',
    then: (schema) => schema.required('Return date is required')
  }),

  items: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string().required('Product is required'),
        quantity: Yup.number().min(1, 'Min 1').required('Quantity required')
      })
    )
    .min(1, 'At least one product is required')
}).test(
  'customer-required',
  'Select a client or enter a new client name',
  (values) => {
    return !!values?.customerId || !!values?.customerName;
  }
);

const StockOutForm = ({ handleClose, product }: StockOutFormProps) => {
  const { stock, stockOutSucess, fetchAllStock } = useStockStore();
  const { customers, fetchAllCustomers } = useCustomerStore();

  const { recordStockOut } = useStockStore();

  useEffect(() => {
    // if (product && product?.type !== 'CALIBRATION') {
    fetchAllStock();
    // }
    fetchAllCustomers();
  }, [product]); // Only depend on product to avoid infinite re-renders

  const clientOptions =
    customers?.map((c) => ({
      value: c.id,
      label: c.name
    })) ?? [];

  const productOptions =
    stock?.stocks?.map((s: any) => ({
      value: s.product.id,
      label: `${s.product.name} (${s.product.serialNumber})`
    })) ?? [];

  const initialValues: FormValues = {
    customerId: '',
    customerName: '',
    type: 'SOLD',
    transactionDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    items: [
      {
        productId: product?.value ?? '',
        quantity: product?.type === 'ITEM' ? '1' : '1'
      }
    ]
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const payload = {
        ...(values.customerId
          ? { customerId: values.customerId }
          : { customerName: values.customerName }),

        type: values.type,
        transactionDate: values.transactionDate,

        ...(values.type === 'RENTED' && {
          expectedReturnDate: values.returnDate
        }),

        items: values.items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity)
        }))
      };

      await recordStockOut(payload as any);
      if (stockOutSucess) {
        toast.success(
          values.type === 'SOLD'
            ? 'Item sold successfully!'
            : 'Item rented successfully!'
        );
      }
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
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
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
                  {product?.type !== 'CALIBRATION' ? (
                    <>
                      <option value="SOLD">Sold</option>
                      <option value="RENTED">Rented</option>
                    </>
                  ) : (
                    <>
                      {' '}
                      <option value="MAINTAINED">Maintained</option>
                      <option value="NOT_MAINTAINED">Not_Maintained</option>
                    </>
                  )}
                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>{' '}
            </div>

            {/* Client */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Client <span className="text-red-500">*</span>
              </label>

              <Select
                id="customerId"
                name="customerId"
                options={clientOptions}
                placeholder="Select client"
                isClearable
                menuPortalTarget={document.body}
                onChange={(option) => {
                  setFieldValue('customerId', option ? option.value : '');
                  if (option?.value) {
                    setFieldValue('customerName', '');
                  }
                }}
                value={
                  clientOptions.find(
                    (opt) => opt.value === values.customerId
                  ) || null
                }
                className="mt-2"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    padding: '2px',
                    borderColor: state.isFocused ? '#073c56' : '#073c5666',
                    boxShadow: state.isFocused
                      ? '0 0 0 2px rgba(7,60,86,0.2)'
                      : 'none',
                    '&:hover': { borderColor: '#073c56' }
                  }),
                  placeholder: (base) => ({ ...base, color: '#6b7280' }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    zIndex: 9999
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? '#073c56'
                      : state.isFocused
                        ? '#073c5620'
                        : 'white',
                    color: state.isSelected ? 'white' : '#111827',
                    padding: '10px 12px',
                    cursor: 'pointer'
                  })
                }}
              />
            </div>

            {!values.customerId && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Or enter new client name
                </label>
                <Field
                  name="customerName"
                  type="text"
                  placeholder="Client name"
                  className="w-full rounded-xl px-3 py-2 border border-[#073c56]/40"
                />
              </div>
            )}

            <ErrorMessage
              name="customerName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />

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

            {/* Products */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-800 mb-2">Products</h3>

              <FieldArray name="items">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.items.map((item, index) => {
                      const selectedProduct = stock?.stocks.find(
                        (s: any) => s.product.id === item.productId
                      );
                      const isPrefilled = !!product;

                      const isItemType =
                        selectedProduct?.product.type === 'ITEM';

                      return (
                        <div key={index} className="flex gap-3 items-end">
                          {/* Product */}
                          <div className="flex-1">
                            <label className="block text-sm font-medium">
                              Product
                            </label>
                            <Select
                              name={`items.${index}.productId`}
                              options={productOptions}
                              placeholder="Select product"
                              isClearable
                              isDisabled={isPrefilled && index === 0}
                              menuPortalTarget={document.body}
                              onChange={(option) => {
                                const productId = option ? option.value : '';
                                setFieldValue(
                                  `items.${index}.productId`,
                                  productId
                                );

                                const product = stock?.stocks.find(
                                  (s: any) => s.product.id === productId
                                );

                                if (product?.product.type === 'ITEM') {
                                  setFieldValue(`items.${index}.quantity`, '1');
                                }
                              }}
                              value={
                                productOptions.find(
                                  (opt : any) => opt.value === item.productId
                                ) || null
                              }
                              className="mt-1"
                              classNamePrefix="react-select"
                              styles={{
                                control: (base, state) => ({
                                  ...base,
                                  borderRadius: '0.75rem',
                                  padding: '2px',
                                  borderColor: state.isFocused
                                    ? '#073c56'
                                    : '#073c5666',
                                  boxShadow: state.isFocused
                                    ? '0 0 0 2px rgba(7,60,86,0.2)'
                                    : 'none',
                                  '&:hover': { borderColor: '#073c56' }
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: '#6b7280'
                                }),
                                menu: (base) => ({
                                  ...base,
                                  borderRadius: '0.75rem',
                                  overflow: 'hidden',
                                  zIndex: 9999
                                }),
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999
                                }),
                                option: (base, state) => ({
                                  ...base,
                                  backgroundColor: state.isSelected
                                    ? '#073c56'
                                    : state.isFocused
                                      ? '#073c5620'
                                      : 'white',
                                  color: state.isSelected ? 'white' : '#111827',
                                  padding: '10px 12px',
                                  cursor: 'pointer'
                                })
                              }}
                            />
                          </div>

                          {/* Quantity */}
                          <div className="w-32">
                            <label className="block text-sm font-medium">
                              Qty
                            </label>
                            <Field
                              name={`items.${index}.quantity`}
                              type="number"
                              min="1"
                              disabled={isItemType}
                              className="w-full rounded-xl border px-3 py-2 disabled:bg-gray-100"
                            />
                          </div>

                          {/* Remove */}
                          {values.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-white-500 font-bold px-2 rounded-full"
                            >
                              −
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Product */}
                    {product?.type !== 'CALIBRATION' && (
                      <button
                        type="button"
                        onClick={() => push({ productId: '', quantity: '1' })}
                        className="font-medium"
                      >
                        + Add another product
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

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
                    : values.type === 'RENTED'
                      ? 'Record Rental'
                      : 'Record Stock Out'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StockOutForm;
