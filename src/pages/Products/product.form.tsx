import { useProductStore } from '../../store/productStore';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { useCategoryStore } from '../../store/categoriesStore';
import { useSupplierStore } from '../../store/supplierStore';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import type { ProductFormValues, ProductPayload } from '../../types/product';
import { ProductSchema } from '../../schemas/productSchema';
import productApi from '../../api/productApi';

interface ProductFormProps {
  handleClose: () => void;
  initialValues: ProductFormValues;
  isEditClicked: boolean;
}

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: '0.75rem',
    padding: '2px',
    borderColor: state.isFocused ? '#073c56' : '#073c5666',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(7,60,86,0.2)' : 'none',
    '&:hover': { borderColor: '#073c56' },
  }),
  placeholder: (base: any) => ({ ...base, color: '#6b7280' }),
  menu: (base: any) => ({ ...base, borderRadius: '0.75rem', overflow: 'hidden', zIndex: 9999 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#073c56' : state.isFocused ? '#073c5620' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    padding: '10px 12px',
    cursor: 'pointer',
  }),
};

const ProductForm = ({ handleClose, initialValues, isEditClicked }: ProductFormProps) => {
  const { listProducts, createProduct, updateProduct, loading } = useProductStore();
  const { fetchCategories, categories } = useCategoryStore();
  const { fetchSuppliers, suppliers } = useSupplierStore();

  // Product names in the currently selected category (for the combobox)
  const [categoryProductNames, setCategoryProductNames] = useState<string[]>([]);
  const [loadingNames, setLoadingNames] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
    // Pre-load names when editing (category already selected)
    if (initialValues.categoryId) {
      loadNamesForCategory(initialValues.categoryId);
    }
  }, []);

  const loadNamesForCategory = async (categoryId: string) => {
    if (!categoryId) { setCategoryProductNames([]); return; }
    try {
      setLoadingNames(true);
      // Fetch both seeded suggestions AND names from already-added products in parallel
      const [suggestionsRes, productsRes] = await Promise.allSettled([
        productApi.fetchSuggestions(categoryId),
        productApi.fetchProducts({ categoryId, limit: 200 }),
      ]);

      const suggestionNames: string[] =
        suggestionsRes.status === 'fulfilled'
          ? (suggestionsRes.value.data?.data?.names ?? [])
          : [];

      const productNames: string[] =
        productsRes.status === 'fulfilled'
          ? (productsRes.value.data?.data?.products ?? []).map((p: any) => p.name)
          : [];

      // Merge and deduplicate, keep alphabetical order
      const merged = [...new Set([...suggestionNames, ...productNames])].sort();
      setCategoryProductNames(merged);
    } catch {
      setCategoryProductNames([]);
    } finally {
      setLoadingNames(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const isCalibration = values.type === 'calibration';

      const payload: ProductPayload & { supplierName?: string } = {
        name: values.name,
        categoryId: values.categoryId,
        type: isCalibration ? 'CALIBRATION' : values.type === 'item' ? 'ITEM' : 'QUANTITY',
        description: values.description || null,
        serialNumber: values.serialNumber,
        warranty: isCalibration ? null : values.warranty || null,
        costPrice: isCalibration ? null : (values.costPrice ?? null),
        entryDate: new Date(values.entryDate).toISOString(),
        quantity: values.type === 'item' ? 1 : (values.quantity ?? 1),
        condition: values.condition,
      };

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
      toast.error(error?.message || 'Failed to save product');
    }
  };

  const categoryOptions = categories?.map((c) => ({ value: c.id!, label: c.name })) ?? [];

  const supplierOptions = suppliers?.map((s) => ({ value: s.id!, label: s.name })) ?? [];

  const productTypeOptions = [
    { value: 'item', label: 'Item' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'calibration', label: 'Calibration' },
  ];

  const conditionOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'SECOND_HAND', label: 'Second Hand' },
    { value: 'OLD', label: 'Old' },
  ];

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, ...formik }) => {
          const isCalibration = formik.values.type === 'calibration';

          const nameOptions = categoryProductNames.map((n) => ({ value: n, label: n }));

          return (
            <Form>
              {/* Row 1: Category + Product Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category — must be selected first */}
                <div>
                  <label className="block mb-1 font-medium">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={categoryOptions}
                    placeholder="Select category first"
                    isClearable
                    menuPortalTarget={document.body}
                    styles={selectStyles}
                    value={categoryOptions.find((o) => o.value === formik.values.categoryId) || null}
                    onChange={(option) => {
                      const id = option ? option.value! : '';
                      formik.setFieldValue('categoryId', id);
                      // Reset name when category changes
                      if (id !== formik.values.categoryId) {
                        formik.setFieldValue('name', '');
                      }
                      loadNamesForCategory(id);
                    }}
                    className="mt-2"
                    classNamePrefix="react-select"
                  />
                  <ErrorMessage name="categoryId" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Product Type */}
                <div>
                  <label className="block mb-1 font-medium">Product Type</label>
                  <Select
                    options={productTypeOptions}
                    placeholder="Select type"
                    styles={selectStyles}
                    value={productTypeOptions.find((o) => o.value === formik.values.type) || null}
                    onChange={(option) => formik.setFieldValue('type', option ? option.value : '')}
                    className="mt-2"
                    classNamePrefix="react-select"
                  />
                  <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Product Name — combobox filtered by category */}
                <div>
                  <label className="block mb-1 font-medium">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <CreatableSelect
                    isDisabled={!formik.values.categoryId}
                    isLoading={loadingNames}
                    isClearable
                    menuPortalTarget={document.body}
                    placeholder={
                      formik.values.categoryId
                        ? 'Select or type a product name'
                        : 'Select a category first'
                    }
                    options={nameOptions}
                    styles={selectStyles}
                    formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                    value={formik.values.name ? { value: formik.values.name, label: formik.values.name } : null}
                    onChange={(option) => formik.setFieldValue('name', option ? option.value : '')}
                    className="mt-2"
                    classNamePrefix="react-select"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Condition */}
                <div>
                  <label className="block mb-1 font-medium">Condition</label>
                  <Select
                    options={conditionOptions}
                    placeholder="Select condition"
                    styles={selectStyles}
                    value={conditionOptions.find((o) => o.value === formik.values.condition) || null}
                    onChange={(option) => formik.setFieldValue('condition', option ? option.value : 'NEW')}
                    className="mt-2"
                    classNamePrefix="react-select"
                  />
                  <ErrorMessage name="condition" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Entry Date */}
                <div>
                  <label className="block mb-1 font-medium">Entry Date</label>
                  <Field
                    type="date"
                    name="entryDate"
                    className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                  />
                  <ErrorMessage name="entryDate" component="div" className="text-red-500 text-sm mt-1" />
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

              {/* Supplier */}
              <div className="mt-3 w-full">
                <label className="block mb-1 font-medium">Supplier</label>
                <Select
                  options={supplierOptions}
                  placeholder="Select supplier"
                  isClearable
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                  value={supplierOptions.find((o) => o.value === formik.values.supplierId) || null}
                  onChange={(option) => formik.setFieldValue('supplierId', option ? option.value : '')}
                  className="mt-2"
                  classNamePrefix="react-select"
                />

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
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {!isCalibration && (
                  <div>
                    <label className="block mb-1 font-medium">Warranty</label>
                    <Field
                      name="warranty"
                      className="mt-2 block w-full rounded-xl px-3 py-2 text-gray-900 border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
                    />
                  </div>
                )}

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
                        <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 justify-end mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-background rounded-full border border-secondary text-primary px-4 py-1 hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-[#073c56] rounded-full text-white px-4 py-1 hover:bg-[#055082] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || loading
                    ? initialValues.id ? 'Updating...' : 'Adding...'
                    : initialValues.id ? 'Update' : 'Save'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductForm;
