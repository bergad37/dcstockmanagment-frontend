import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useState } from 'react';
import authApi from '../api/authApi';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: { email: string }, { setSubmitting }: any) => {
    try {
      await authApi.forgotPassword(values.email);
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send reset email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 py-10 bg-white">
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <div className="flex flex-col items-center">
          <img
            alt="dc survey ltd logo"
            src="/logo.png"
            className="mx-auto h-40 w-60 sm:h-40 sm:w-60 object-cover"
          />
          <h2 className="mt-6 text-center text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="mt-8">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-green-700 font-medium">Check your email</p>
                <p className="text-green-600 text-sm mt-1">
                  If an account with that email exists, a password reset link has been sent.
                </p>
              </div>
              <Link
                to="/"
                className="block text-sm font-semibold text-[#073c56] hover:underline mt-4"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#073c56]">
                      Email address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className={`mt-2 block w-full rounded-3xl px-3 py-2 text-gray-900 border ${
                        errors.email && touched.email ? 'border-red-500' : 'border-[#073c56]/40'
                      } focus:border-[#073c56] focus:outline-none`}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex rounded-3xl w-full justify-center px-3 py-2 text-sm font-semibold text-white shadow bg-[#073c56] hover:bg-[#062e42] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <div className="text-center">
                    <Link to="/" className="text-xs font-semibold text-[#073c56] hover:underline">
                      Back to Login
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
