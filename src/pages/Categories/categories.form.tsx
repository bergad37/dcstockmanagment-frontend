// import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import categoryApi, { type CategoryPayload } from '../../api/categoryApi';
import { toast } from 'sonner';
import { useCategoryStore } from '../../store/categoriesStore';

// Validation schema
const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Category name too short')
    .max(50, 'Category name too long')
    .required('Category name is required')
});

interface CategoryFormProps {
  handleClose: () => void;
}

const CategoryForm = ({ handleClose }: CategoryFormProps) => {
  const { fetchCategories } = useCategoryStore();

  const handleSubmit = async (values: CategoryPayload) => {
    try {
      const response = await categoryApi.create(values);
      if (response.data.success) {
        toast.success('Category added successfully!');
        handleClose();
        fetchCategories();
      }
    } catch (error: any) {
      toast.warning(
        error.response?.data?.data?.message || 'Failed to add category'
      );
    }
  };

  return (
    <div className="my-4 p-4 max-w-md bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#073c56' }}>
        Add Category
      </h2>

      <Formik
        initialValues={{ name: '' }}
        validationSchema={CategorySchema}
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
                type="submit"
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
                {isSubmitting ? 'Adding...' : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CategoryForm;
