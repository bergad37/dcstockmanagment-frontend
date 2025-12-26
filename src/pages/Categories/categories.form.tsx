import { Formik, Form, Field, ErrorMessage } from 'formik';
import { z } from 'zod';
import categoryApi, { type CategoryPayload } from '../../api/categoryApi';
import { toast } from 'sonner';
import { useCategoryStore } from '../../store/categoriesStore';

export interface InitialValuesType {
  id: string | null;
  name: string;
}
const CategorySchemaZ = z.object({
  name: z.string().min(2, 'Category name too short').max(50, 'Category name too long')
});

const validateWithZod = (schema: z.ZodSchema<any>) => (values: any) => {
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  const zodErr = result.error;
  zodErr.issues.forEach((issue: any) => {
    const path = issue.path?.[0] as string | undefined;
    if (path) errors[path] = issue.message;
  });
  return errors;
};

interface CategoryFormProps {
  handleClose: () => void;
  initialValues: InitialValuesType;
}

const CategoryForm = ({ handleClose, initialValues }: CategoryFormProps) => {
  const { fetchCategories } = useCategoryStore();

  // Use Formik's setErrors to display backend validation errors per field
  const handleSubmit = async (values: CategoryPayload, helpers: { setErrors: (e: Record<string, string>) => void; setSubmitting: (b: boolean) => void; }) => {
    const { setErrors, setSubmitting } = helpers;
    try {
      const payload: CategoryPayload = { name: values.name };
      let response;
      if (initialValues?.id) {
        response = await categoryApi.update(initialValues.id, payload);
        const message = response?.data?.message || 'Category updated successfully!';
        if (response.data?.success) {
          toast.success(message);
          handleClose();
          fetchCategories();
        }
      } else {
        response = await categoryApi.create(payload);
        const message = response?.data?.message || 'Category added successfully!';
        if (response.data?.success) {
          toast.success(message);
          handleClose();
          fetchCategories();
        }
      }
    } catch (error: any) {
      const resp = error?.response?.data;
      // backend may return validation details in `error` field as JSON string
      if (resp?.error) {
        try {
          const parsed = typeof resp.error === 'string' ? JSON.parse(resp.error) : resp.error;
          const fieldErrors: Record<string, string> = {};
          if (Array.isArray(parsed)) {
            parsed.forEach((it: any) => {
              if (it.path && it.msg) fieldErrors[it.path] = it.msg;
            });
          }
          if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
            return;
          }
        } catch (e) {
          // fallthrough to generic message
        }
      }

      toast.warning(resp?.message || resp?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-4 p-4 max-w-md bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#073c56' }}>
        {initialValues?.id ? 'Edit Category' : 'Add Category'}
      </h2>

      <Formik
        initialValues={initialValues}
        validate={validateWithZod(CategorySchemaZ)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 font-medium">
                Category Name
              </label>
              <Field
                name="name"
                placeholder="Enter category name"
                className={`mt-2 block w-full  rounded-xl px-3 py-2 text-gray-900 border  border-[#073c56]/40 focus:border-[#073c56] focus:outline-none`}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="flex item-center gap-2 justify-end">
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
                className="bg-[#073c56] rounded-full text-white px-4 py-1 hover:bg-[ #055082]"
              >
                {isSubmitting ? (initialValues?.id ? 'Saving...' : 'Adding...') : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CategoryForm;
