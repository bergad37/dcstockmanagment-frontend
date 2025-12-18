import { useProductStore } from '../../store/productStore';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { useCategoryStore } from '../../store/categoriesStore';
import { useSupplierStore } from '../../store/supplierStore';
import { useEffect } from 'react';
import Select from 'react-select';
import type { ProductFormValues, ProductPayload } from '../../types/product';
import { ProductSchema } from '../../schemas/productSchema';

interface ProductFormProps {
  handleClose: () => void;
  initialValues: ProductFormValues;
}

const ProductForm = ({ handleClose, initialValues }: ProductFormProps) => {
  const { listProducts, createProduct, updateProduct } = useProductStore();
  const { fetchCategories, categories } = useCategoryStore();
  const { fetchSuppliers, suppliers } = useSupplierStore();

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, [fetchCategories, fetchSuppliers]);

  const handleSubmit = async (values: any) => {
    try {
      // Normalize payload to backend expectations
      const payload: ProductPayload = {
        name: values.name,
        categoryId: values.categoryId,
        supplierId: values.supplierId || null,
        type: values.type === 'item' ? 'ITEM' : 'QUANTITY',
        serialNumber: values.serialNumber || null,
        warranty: values.warranty || null,
        description: values.description || null,
        costPrice: values.costPrice ?? null,
        entryDate: values.entryDate
      };

      // include quantity for QUANTITY type only when provided and valid
      if (values.type === 'quantity') {
        const q = values.quantity;
        // avoid sending 0 when the input is empty ('') or null/undefined
        if (q !== '' && q != null) {
          const qi = Number(q);
          if (Number.isInteger(qi) && qi > 0) {
            payload.quantity = qi;
          }
        }
      }

      // for 'item' products, quantity is implicitly 1
      if (values.type === 'item') {
        payload.quantity = 1;
      }

      if (values.id) {
        await updateProduct(values.id, payload);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(payload);
        toast.success('Product added successfully!');
      }

      handleClose();
      await listProducts();
    } catch (error: any) {
      const backendMsg = error?.response?.data?.error || error?.response?.data?.message;
      // backend may return validation JSON string
      if (typeof backendMsg === 'string') {
        try {
          const parsed = JSON.parse(backendMsg);
          const first = Array.isArray(parsed) ? parsed[0] : parsed;
          toast.warning(first?.msg || 'Validation failed');
        } catch {
          toast.warning(backendMsg || 'Failed to save product');
        }
      } else {
        toast.warning('Failed to save product');
      }
    }
  };

  const categoryOptions =
    categories?.map((c) => ({
      value: c.id,
      label: c.name
    })) ?? [];

  const supplierOptions =
    suppliers?.map((s) => ({
      value: s.id,
      label: s.name
    })) ?? [];

  const productTypeOptions = [
    { value: 'item', label: 'Item' },
    { value: 'quantity', label: 'Quantity' }
  ];

  return (
    <div>
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
                  id="categoryId"
                  name="categoryId"
                  options={categoryOptions}
                  placeholder="Select category"
                  isClearable
                  onChange={(option) =>
                    formik.setFieldValue(
                      'categoryId',
                      option ? option.value : ''
                    )
                  }
                  value={
                    categoryOptions.find(
                      (opt) => opt.value === formik.values.categoryId
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
                  name="categoryId"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                {/* Supplier select (optional) */}
                <div className="mt-3">
                  <label className="block mb-1 font-medium">Supplier</label>
                  <Select
                    id="supplierId"
                    name="supplierId"
                    options={supplierOptions}
                    placeholder="Select supplier (optional)"
                    isClearable
                    onChange={(option) =>
                      formik.setFieldValue(
                        'supplierId',
                        option ? option.value : ''
                      )
                    }
                    value={
                      supplierOptions.find(
                        (opt) => opt.value === formik.values.supplierId
                      ) || null
                    }
                    className="mt-2"
                    classNamePrefix="react-select"
                  />
                </div>
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
                <label className="block mb-1 font-medium">Serial Number</label>
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
              {/* Quantity (editable for 'quantity' type, read-only =1 for 'item') */}
              <div>
                <label className="block mb-1 font-medium">Quantity</label>
                {formik.values.type === 'quantity' ? (
                  <>
                    <Field
                      name="quantity"
                      type="number"
                      placeholder="Enter quantity"
                      className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </>
                ) : (
                  <input
                    readOnly
                    value={1}
                    className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-500 bg-gray-100 border border-[#e5e7eb]"
                  />
                )}
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
                {isSubmitting
                  ? initialValues.id
                    ? 'Updating...'
                    : 'Adding...'
                  : initialValues.id
                  ? 'Update'
                  : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    // </div>
  );
};

export default ProductForm;
