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
  isEditClicked: boolean;
}

const ProductForm = ({
  handleClose,
  initialValues,
  isEditClicked
}: ProductFormProps) => {
  const { listProducts, createProduct, updateProduct } = useProductStore();
  const { fetchCategories, categories } = useCategoryStore();
  const { fetchSuppliers, suppliers } = useSupplierStore();

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, [fetchCategories, fetchSuppliers]);

  const handleSubmit = async (values: any) => {
    try {
      const isCalibration = values.type === 'calibration';

      const payload: ProductPayload & {
        supplierName?: string;
      } = {
        name: values.name,
        categoryId: values.categoryId,
        type: isCalibration
          ? 'CALIBRATION'
          : values.type === 'item'
          ? 'ITEM'
          : 'QUANTITY',

        description: values.description || null,
        serialNumber: values.serialNumber,
        warranty: isCalibration ? null : values.warranty || null,
        costPrice: isCalibration ? null : values.costPrice ?? null,
        entryDate: values.entryDate,
        quantity: values.quantity ?? 1
      };

      // Quantity rules
      payload.quantity = values.type === 'item' ? 1 : values.quantity ?? 1;

      // Supplier handling
      if (values.supplierId) {
        payload.supplierId = values.supplierId;
      } else if (values.supplierName) {
        payload.supplierName = values.supplierName;
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
      toast.warning('Failed to save product');
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
    { value: 'quantity', label: 'Quantity' },
    { value: 'calibration', label: 'Calibration' }
  ];

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, ...formik }) => {
          const isCalibration = formik.values.type === 'calibration';
          return (
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

              <div className="mt-3 w-full">
                <label className="block mb-1 font-medium">Supplier</label>

                <Field
                  name="supplierId"
                  as="select"
                  className="w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    formik.setFieldValue('supplierId', e.target.value);
                    if (e.target.value) {
                      formik.setFieldValue('supplierName', '');
                    }
                  }}
                >
                  <option value="">Select existing supplier...</option>
                  {suppliers?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Field>

                {!formik.values.supplierId && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Or enter new {isCalibration ? 'supplier' : 'client'} name
                    </label>
                    <Field
                      name="supplierName"
                      type="text"
                      placeholder="Supplier name"
                      className="w-full rounded-xl px-3 py-2 border border-[#073c56]/40"
                    />
                  </div>
                )}

                <ErrorMessage
                  name="supplierName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Group 2: Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Warranty */}
                {!isCalibration && (
                  <div>
                    <label className="block mb-1 font-medium">Warranty</label>
                    <Field
                      name="warranty"
                      className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                    />
                  </div>
                )}

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
                {!isCalibration && (
                  <div>
                    <label className="block mb-1 font-medium">Cost Price</label>
                    <Field
                      name="costPrice"
                      type="number"
                      className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                    />
                  </div>
                )}

                {/* Quantity (editable for 'quantity' type, read-only =1 for 'item') */}
                {!isEditClicked && (
                  <div>
                    <label className="block mb-1 font-medium">Quantity</label>

                    {formik.values.type === 'item' ? (
                      <input
                        readOnly
                        value={1}
                        className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-500 bg-gray-100 border border-[#e5e7eb]"
                      />
                    ) : (
                      <>
                        <Field
                          name="quantity"
                          type="number"
                          min={1}
                          className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                        />
                        <ErrorMessage
                          name="quantity"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </>
                    )}
                  </div>
                )}
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
          );
        }}
      </Formik>
    </div>
    // </div>
  );
};

export default ProductForm;
