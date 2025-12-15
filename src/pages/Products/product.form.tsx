import { useProductStore } from '../../store/productStore';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import type { ProductPayload } from '../../api/productApi';
import { toast } from 'sonner';
import productApi from '../../api/productApi';
import { useCategoryStore } from '../../store/categoriesStore';
import { useEffect } from 'react';
import Select from 'react-select';

export interface InitialValuesType {
  id: string | null;
  name: string;
  type: 'item' | 'quantity';
  description: string | null;
  warranty: string | null;
  category: string;
  serialNumber: string | null;
  costPrice: number | null;
  entryDate: string;
}

// FULL validation schema with ALL fields
const ProductSchema = Yup.object().shape({
  id: Yup.string().nullable(),

  name: Yup.string()
    .min(2, 'Product name too short')
    .max(50, 'Product name too long')
    .required('Product name is required'),

  type: Yup.string()
    .oneOf(['item', 'quantity'], 'Invalid product type')
    .required('Product type is required'),

  description: Yup.string().nullable(),

  warranty: Yup.string().nullable(),

  category: Yup.string().required('Category is required'),

  serialNumber: Yup.string().nullable(),

  costPrice: Yup.number()
    .typeError('Cost price must be a number')
    .nullable()
    .min(0, 'Cost price must be positive'),

  entryDate: Yup.string().required('Entry date is required')
});

interface ProductFormProps {
  handleClose: () => void;
  initialValues: InitialValuesType;
}

const ProductForm = ({ handleClose, initialValues }: ProductFormProps) => {
  const { listProducts } = useProductStore();
  const { fetchCategories, categories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (values: ProductPayload) => {
    try {
      const response = await productApi.create(values);
      if (response.data.success) {
        toast.success('Product added successfully!');
        handleClose();
        listProducts();
      }
    } catch (error: any) {
      toast.warning(
        error.response?.data?.data?.message || 'Failed to add product'
      );
    }
  };

  const categoryOptions =
    categories?.map((c) => ({
      value: c.id,
      label: c.name
    })) ?? [];

  const productTypeOptions = [
    { value: 'item', label: 'Item' },
    { value: 'quantity', label: 'Quantity' }
  ];

  return (
    <div>
      <div className="my-4 p-4 max-w-md bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#073c56' }}>
          Add Product
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, ...formik }) => (
            <Form>
              {/* Group 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">
                    Product Name
                  </label>
                  <Field
                    name="name"
                    placeholder="Enter product name"
                    className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Product Type */}
                <div>
                  <label className="block mb-1 font-medium">Product Type</label>
                  <Select
                    id="type"
                    name="type"
                    options={productTypeOptions}
                    placeholder="Select type"
                    onChange={(option) =>
                      formik.setFieldValue('type', option ? option.value : '')
                    }
                    value={
                      productTypeOptions.find(
                        (opt) => opt.value === formik.values.type
                      ) || null
                    }
                    className="mt-2"
                    classNamePrefix="react-select"
                  />
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block mb-1 font-medium">Category</label>

                  <Select
                    id="category"
                    name="category"
                    options={categoryOptions}
                    placeholder="Select category"
                    isClearable
                    onChange={(option) =>
                      formik.setFieldValue(
                        'category',
                        option ? option.value : ''
                      )
                    }
                    value={
                      categoryOptions.find(
                        (opt) => opt.value === formik.values.category
                      ) || null
                    }
                    className="mt-2"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        padding: '2px',
                        borderColor: state.isFocused ? '#073c56' : '#073c5666',
                        boxShadow: state.isFocused
                          ? '0 0 0 2px rgba(7,60,86,0.2)'
                          : 'none',
                        '&:hover': { borderColor: '#073c56' }
                      }),
                      placeholder: (base) => ({ ...base, color: '#6b7280' }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        overflow: 'hidden'
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? '#073c56'
                          : state.isFocused
                          ? '#073c5620'
                          : 'white',
                        color: state.isSelected ? 'white' : '#111827',
                        padding: '10px 12px',
                        cursor: 'pointer'
                      })
                    }}
                  />

                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Entry Date */}
                <div>
                  <label className="block mb-1 font-medium">Entry Date</label>
                  <Field
                    type="date"
                    name="entryDate"
                    className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                  />
                  <ErrorMessage
                    name="entryDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block mb-1 font-medium">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter product description"
                  className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                />
              </div>

              {/* Group 2: Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Warranty */}
                <div>
                  <label className="block mb-1 font-medium">Warranty</label>
                  <Field
                    name="warranty"
                    placeholder="e.g. 1 year"
                    className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label className="block mb-1 font-medium">
                    Serial Number
                  </label>
                  <Field
                    name="serialNumber"
                    placeholder="Enter serial number"
                    className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Cost Price */}
                <div>
                  <label className="block mb-1 font-medium">Cost Price</label>
                  <Field
                    name="costPrice"
                    type="number"
                    placeholder="Enter cost price"
                    className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                  />
                  <ErrorMessage
                    name="costPrice"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
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
                  {isSubmitting ? 'Adding...' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductForm;
