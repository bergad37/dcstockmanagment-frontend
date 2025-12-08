import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
// import { toast } from 'sonner';
// import { useEffect } from 'react';
// import userApi from '../../api/userApi';
// import { useUserStore } from '../../store/userStore';
// import { useRoleStore } from '../../store/roleStore';

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
  //   const { listUsers } = useUserStore();
  //   const { roles, fetchRoles } = useRoleStore();

  //   useEffect(() => {
  //     fetchRoles();
  //   }, [fetchRoles]);

  const roleOptions =
    [
      { name: 'Admin', id: 'admin' },
      { name: 'Manager', id: 'manager' }
    ]?.map((r) => ({
      value: r.id,
      label: r.name
    })) ?? [];

  const handleSubmit = async (values: UserInitialValues) => {
    console.log(values);
    // try {
    //   const response = await userApi.create(values);

    //   if (response.data.success) {
    //     toast.success('User added successfully!');
    //     handleClose();
    //     listUsers();
    //   }
    // } catch (error: any) {
    //   toast.warning(error.response?.data?.message || 'Failed to add user');
    // }
  };

  return (
    <div className="my-4 p-4 max-w-md bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#073c56' }}>
        Add User
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={UserSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, ...formik }) => (
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
                name="role"
                placeholder="Enter role"
                className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 
               focus:border-[#073c56] focus:outline-none"
              />

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
