import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required')
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const submit = async (values: { email: string; password: string }) => {
    const ok = await login(values);
    if (!ok) {
      toast.error('Login failed');
    }
    if (ok) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen   items-center justify-center px-4 sm:px-6 py-10 bg-white">
      <div className="w-full border border-[ #1e5e7eff]  sm:w-3/4 md:w-1/2 lg:w-1/3  bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <div className="flex flex-col items-center">
          <img
            alt="dc survey ltd logo Company Logo"
            src="https://res.cloudinary.com/ds04ivdrj/image/upload/v1764774518/dcstocklogo_sk2qvt.png"
            className="mx-auto rounded-full h-32 w-32 sm:h-40 sm:w-40 object-cover"
          />

          <h2 className="mt-6 text-center text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
            Access Admin Panel
          </h2>
        </div>

        <div className="mt-8">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={submit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#073c56]"
                  >
                    Email address
                  </label>

                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`mt-2 block w-full rounded-3xl px-3 py-2 text-gray-900
                    border ${
                      errors.email && touched.email
                        ? 'border-red-500'
                        : 'border-[#073c56]/40'
                    }
                    focus:border-[#073c56] focus:outline-none`}
                  />

                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#073c56]"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-[#073c56] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`mt-2 block w-full rounded-3xl px-3 py-2 text-gray-900 
                    border ${
                      errors.password && touched.password
                        ? 'border-red-500'
                        : 'border-[#073c56]/40'
                    }
                    focus:border-[#073c56] focus:outline-none`}
                  />

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex  rounded-3xl w-full justify-center px-3 py-2 
                  text-sm font-semibold text-white shadow 
                  bg-[#073c56] hover:bg-[#062e42] 
                  disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
