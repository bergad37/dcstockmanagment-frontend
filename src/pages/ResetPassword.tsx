import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import authApi from '../api/authApi';

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (
    values: { newPassword: string; confirmPassword: string },
    { setSubmitting }: any
  ) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      setSubmitting(false);
      return;
    }
    try {
      await authApi.resetPassword(token, values.newPassword);
      toast.success('Password reset successfully. Please log in.');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-white">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-medium">Invalid or expired reset link.</p>
          <Link to="/" className="text-sm font-semibold text-[#073c56] hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 py-10 bg-white">
      <div className="w-full border border-[#1e5e7eff] sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <div className="flex flex-col items-center">
          <img
            alt="dc survey ltd logo"
            src="/logo.png"
            className="mx-auto h-40 w-60 sm:h-40 sm:w-60 object-cover"
          />
          <h2 className="mt-6 text-center text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Choose a strong password for your account.
          </p>
        </div>

        <div className="mt-8">
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-5">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-[#073c56]">
                    New Password
                  </label>
                  <div className="relative mt-2">
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type={showNew ? 'text' : 'password'}
                      className={`block w-full rounded-3xl px-3 py-2 pr-10 text-gray-900 border ${
                        errors.newPassword && touched.newPassword
                          ? 'border-red-500'
                          : 'border-[#073c56]/40'
                      } focus:border-[#073c56] focus:outline-none`}
                    />
                    <button type="button" onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-gray-400 hover:text-gray-600" tabIndex={-1}>
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#073c56]">
                    Confirm Password
                  </label>
                  <div className="relative mt-2">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      className={`block w-full rounded-3xl px-3 py-2 pr-10 text-gray-900 border ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'border-red-500'
                          : 'border-[#073c56]/40'
                      } focus:border-[#073c56] focus:outline-none`}
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)}
                      className="absolute bg-white right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex rounded-3xl w-full justify-center px-3 py-2 text-sm font-semibold text-white shadow bg-[#073c56] hover:bg-[#062e42] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Reset Password'}
                </button>

                <div className="text-center">
                  <Link to="/" className="text-xs font-semibold text-[#073c56] hover:underline">
                    Back to Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
