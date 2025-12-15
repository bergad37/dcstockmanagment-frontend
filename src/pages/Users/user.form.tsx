import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useUserStore } from '../../store/userStore';
import { toast } from 'sonner';

export interface UserInitialValues {
  id: string | null;
  name: string;
  email: string;
  role: string;
}

const UserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required')
});

interface UserFormProps {
  handleClose: () => void;
  initialValues: UserInitialValues;
}

const UserForm = ({ handleClose, initialValues }: UserFormProps) => {
  const { createUser, updateUser } = useUserStore();

  const roleOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'STAFF', label: 'Staff' }
  ];

  const handleSubmit = async (values: UserInitialValues) => {
    const payload = values as any;
    const result = values.id
      ? await updateUser(values.id, { ...payload, id: undefined })
      : await createUser(payload);

    if (result?.success) {
      toast.success(result.message || (values.id ? 'User updated' : 'User created'));
      handleClose();
    } else {
      toast.error(result?.message || 'Failed to save user');
    }
  };

  return (
    <div className="my-4 p-4 max-w-md bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#073c56' }}>
        Add User
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={UserSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Name */}
            <div className="mb-3">
              <label className="block mb-1 font-medium">Name</label>
              <Field
                name="name"
                placeholder="Enter full name"
                className="mt-2 block w-full rounded-xl px-3 py-2 border border-[#073c56]/40 text-gray-900 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block mb-1 font-medium">Email</label>
              <Field
                name="email"
                type="email"
                placeholder="Enter email"
                className="mt-2 block w-full rounded-xl px-3 py-2 border border-[#073c56]/40 text-gray-900 focus:border-[#073c56] focus:outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block mb-1 font-medium">
                Role
              </label>

              <Field
                as="select"
                name="role"
                className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              >
                <option value="">Select role</option>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Field>

              <ErrorMessage
                name="role"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex item-center gap-2 justify-end mt-6">
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

export default UserForm;
