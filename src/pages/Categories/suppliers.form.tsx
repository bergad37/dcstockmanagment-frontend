import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import supplierApi, { type SupplierPayload } from '../../api/supplierApi';
import { toast } from 'sonner';
import { useSupplierStore } from '../../store/supplierStore';

export interface SupplierInitial {
  id: string | null;
  name: string;
  phone?: string;
  email?: string;
}

const SupplierSchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required('Name is required')
});

interface Props {
  handleClose: () => void;
  initialValues: SupplierInitial;
}

const SupplierForm = ({ handleClose, initialValues }: Props) => {
  const { fetchSuppliers } = useSupplierStore();

  const handleSubmit = async (values: SupplierPayload) => {
    try {
      // Build payload without `id` so we don't send id:null or id:undefined in the request body
      const payload: SupplierPayload = {
        name: values.name,
        phone: values.phone,
        email: values.email
      };

      if (initialValues.id) {
        await supplierApi.update(initialValues.id, payload);
        toast.success('Supplier updated');
      } else {
        await supplierApi.create(payload);
        toast.success('Supplier created');
      }

      handleClose();
      fetchSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save supplier');
    }
  };

  return (
    <div className="my-4 p-4 max-w-md bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#073c56' }}>
        {initialValues.id ? 'Edit Supplier' : 'Add Supplier'}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={SupplierSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label className="block mb-1">Name</label>
              <Field name="name" className="w-full rounded-xl px-3 py-2 border" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-3">
              <label className="block mb-1">Phone</label>
              <Field name="phone" className="w-full rounded-xl px-3 py-2 border" />
            </div>

            <div className="mb-3">
              <label className="block mb-1">Email</label>
              <Field name="email" className="w-full rounded-xl px-3 py-2 border" />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleClose} className="px-4 py-1 rounded-full border">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-1 rounded-full bg-[#073c56] text-white">
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SupplierForm;
