import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Modal from "./ui/Modal";
import authApi from "../api/authApi";

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: Props) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (
    values: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { setSubmitting, resetForm }: any,
  ) => {
    try {
      await authApi.changePassword(values.currentPassword, values.newPassword);
      toast.success("Password changed successfully");
      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <div className="my-4 p-2">
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#073c56] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Field
                    name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    className={`block w-full rounded-xl px-3 py-2 pr-10 border ${
                      errors.currentPassword && touched.currentPassword
                        ? "border-red-500"
                        : "border-[#073c56]/40"
                    } focus:border-[#073c56] focus:outline-none text-gray-900`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 bg-white top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#073c56] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Field
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    className={`block w-full rounded-xl px-3 py-2 pr-10 border ${
                      errors.newPassword && touched.newPassword
                        ? "border-red-500"
                        : "border-[#073c56]/40"
                    } focus:border-[#073c56] focus:outline-none text-gray-900`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute bg-white right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#073c56] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    className={`block w-full rounded-xl px-3 py-2 pr-10 border ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-[#073c56]/40"
                    } focus:border-[#073c56] focus:outline-none text-gray-900`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 bg-white top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-[#073c56]/40 text-[#073c56] px-4 py-1.5 text-sm text-white hover:text-primary hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#073c56] rounded-full text-white px-4 py-1.5 text-sm hover:bg-[#055082] disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Change Password"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
