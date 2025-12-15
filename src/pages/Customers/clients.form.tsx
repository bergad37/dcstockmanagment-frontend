import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useCustomerStore } from '../../store/CustomerStore';
import type { CustomerPayload } from '../../api/customersApi';

export interface CustomerInitialValues {
  id: string | null;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface CustomerFormProps {
  initialValues: CustomerInitialValues;
  handleClose: () => void;
}

// Validation schema
const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('Customer name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  address: Yup.string().required('Address is required'),
  phone: Yup.string()
    .matches(/^[0-9+ ]+$/, 'Invalid phone number')
    .required('Phone number is required')
});

const CustomerForm = ({ initialValues, handleClose }: CustomerFormProps) => {
  const { createCustomer, updateCustomer } = useCustomerStore();

  const handleSubmit = async (values: CustomerPayload) => {
    const payload = values as any;
    const result = values.id
      ? await updateCustomer(values.id, { ...payload, id: undefined })
      : await createCustomer({ ...payload, id: undefined });

    if (result?.success) {
      toast.success(result.message || (values.id ? 'Customer updated' : 'Customer created'));
      handleClose();
    } else {
      toast.error(result?.message || 'Failed to save customer');
    }
  };

  return (
    <div className="my-4 p-4 max-w-md bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#073c56' }}>
        {initialValues?.id ? 'Edit Customer' : 'Add Customer'}
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={CustomerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Customer Names */}
            <div>
              <label className="block mb-1 font-medium">Customer Name</label>
              <Field
                name="name"
                placeholder="Enter client name"
                className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Field
                name="email"
                type="email"
                placeholder="example@mail.com"
                className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <Field
                name="address"
                placeholder="Kigali, Rwanda"
                className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 font-medium">Phone Number</label>
              <Field
                name="phone"
                placeholder="+250 788 000 000"
                className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="bg-background rounded-full border border-secondary text-primary px-4 py-1 hover:bg-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#073c56] rounded-full text-white px-4 py-1 hover:bg-[#055082]"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CustomerForm;
