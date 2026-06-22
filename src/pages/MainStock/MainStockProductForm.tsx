import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoriesStore';
import { useSupplierStore } from '../../store/supplierStore';
import productApi from '../../api/productApi';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: '0.75rem',
    padding: '2px',
    borderColor: state.isFocused ? '#073c56' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(7,60,86,0.15)' : 'none',
    '&:hover': { borderColor: '#073c56' },
    fontSize: '0.875rem',
  }),
  placeholder: (base: any) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
  menu: (base: any) => ({ ...base, borderRadius: '0.75rem', overflow: 'hidden', zIndex: 9999 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#073c56' : state.isFocused ? '#073c5620' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    fontSize: '0.875rem',
    cursor: 'pointer',
  }),
};

const schema = Yup.object({
  name: Yup.string().required('Product name is required'),
  categoryId: Yup.string().required('Category is required'),
  type: Yup.string().oneOf(['ITEM', 'QUANTITY', 'CALIBRATION']).required('Type is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  condition: Yup.string().oneOf(['NEW', 'SECOND_HAND', 'OLD']).required(),
  supplierId: Yup.string().nullable(),
  supplierName: Yup.string(),
  costPrice: Yup.number().min(0).nullable(),
  serialNumber: Yup.string(),
  warranty: Yup.string(),
  description: Yup.string(),
});

const typeOptions = [
  { value: 'QUANTITY', label: 'Quantity' },
  { value: 'ITEM', label: 'Item' },
  { value: 'CALIBRATION', label: 'Calibration' },
];

const conditionOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'SECOND_HAND', label: 'Second Hand' },
  { value: 'OLD', label: 'Old' },
];

export default function MainStockProductForm({ onClose, onSuccess }: Props) {
  const { createProduct, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();

  const [nameOptions, setNameOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingNames, setLoadingNames] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSuppliers(undefined, 1, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNamesForCategory = async (categoryId: string) => {
    if (!categoryId) { setNameOptions([]); return; }
    setLoadingNames(true);
    try {
      const [suggestionsRes, productsRes] = await Promise.allSettled([
        productApi.fetchSuggestions(categoryId),
        productApi.fetchProducts({ categoryId, scope: 'MAIN_STOCK', limit: 200 }),
      ]);
      const suggestionNames: string[] =
        suggestionsRes.status === 'fulfilled' ? (suggestionsRes.value.data?.data?.names ?? []) : [];
      const productNames: string[] =
        productsRes.status === 'fulfilled'
          ? (productsRes.value.data?.data?.products ?? []).map((p: any) => p.name)
          : [];
      const merged = [...new Set([...suggestionNames, ...productNames])].sort();
      setNameOptions(merged.map((n) => ({ value: n, label: n })));
    } catch {
      setNameOptions([]);
    } finally {
      setLoadingNames(false);
    }
  };

  const categoryOptions = (categories ?? []).map((c: any) => ({ value: c.id, label: c.name }));
  const supplierOptions = (suppliers ?? []).map((s: any) => ({ value: s.id, label: s.name }));

  const handleSubmit = async (values: any) => {
    try {
      const payload: any = {
        name: values.name,
        categoryId: values.categoryId,
        type: values.type,
        condition: values.condition,
        quantity: Number(values.quantity),
        costPrice: values.costPrice ? Number(values.costPrice) : null,
        supplierId: values.supplierId || null,
        serialNumber: values.serialNumber || null,
        warranty: values.warranty || null,
        description: values.description || null,
        scope: 'MAIN_STOCK',
        entryDate: new Date().toISOString(),
      };
      if (!values.supplierId && values.supplierName) {
        payload.supplierName = values.supplierName;
      }
      await createProduct(payload);
      toast.success('Product added to Main Stock');
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Failed to create product');
    }
  };

  const errCls = 'text-red-500 text-xs mt-1';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#073c56]';

  return (
    <Formik
      initialValues={{
        name: '',
        categoryId: '',
        type: 'QUANTITY',
        condition: 'NEW',
        quantity: 1,
        supplierId: '',
        supplierName: '',
        costPrice: '',
        serialNumber: '',
        warranty: '',
        description: '',
      }}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-4 p-1">

          {/* Row 1: Category + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <Select
                options={categoryOptions}
                placeholder="Select category first"
                isClearable
                menuPortalTarget={document.body}
                styles={selectStyles}
                value={categoryOptions.find((o) => o.value === values.categoryId) ?? null}
                onChange={(opt) => {
                  const id = opt?.value ?? '';
                  setFieldValue('categoryId', id);
                  if (id !== values.categoryId) setFieldValue('name', '');
                  loadNamesForCategory(id);
                }}
              />
              <ErrorMessage name="categoryId" component="div" className={errCls} />
            </div>
            <div>
              <label className={labelCls}>Type *</label>
              <Select
                options={typeOptions}
                menuPortalTarget={document.body}
                styles={selectStyles}
                value={typeOptions.find((o) => o.value === values.type) ?? null}
                onChange={(opt) => setFieldValue('type', opt?.value ?? 'QUANTITY')}
              />
              <ErrorMessage name="type" component="div" className={errCls} />
            </div>
          </div>

          {/* Row 2: Name + Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Product Name *</label>
              <CreatableSelect
                isDisabled={!values.categoryId}
                isLoading={loadingNames}
                isClearable
                menuPortalTarget={document.body}
                placeholder={values.categoryId ? 'Select or type a name' : 'Select category first'}
                options={nameOptions}
                styles={selectStyles}
                formatCreateLabel={(v) => `Use "${v}"`}
                value={values.name ? { value: values.name, label: values.name } : null}
                onChange={(opt) => setFieldValue('name', opt?.value ?? '')}
              />
              <ErrorMessage name="name" component="div" className={errCls} />
            </div>
            <div>
              <label className={labelCls}>Condition</label>
              <Select
                options={conditionOptions}
                menuPortalTarget={document.body}
                styles={selectStyles}
                value={conditionOptions.find((o) => o.value === values.condition) ?? null}
                onChange={(opt) => setFieldValue('condition', opt?.value ?? 'NEW')}
              />
            </div>
          </div>

          {/* Row 3: Quantity + Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Initial Quantity *</label>
              {values.type === 'ITEM' ? (
                <input readOnly value={1} className="w-full border border-gray-100 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-400" />
              ) : (
                <Field
                  name="quantity"
                  type="number"
                  min={1}
                  className={`${inputCls} ${errors.quantity && touched.quantity ? 'border-red-400' : ''}`}
                />
              )}
              <ErrorMessage name="quantity" component="div" className={errCls} />
            </div>
            <div>
              <label className={labelCls}>Unit Cost</label>
              <Field name="costPrice" type="number" min={0} step="0.01" placeholder="0.00" className={inputCls} />
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className={labelCls}>Supplier</label>
            <Select
              options={supplierOptions}
              placeholder="Select existing supplier"
              isClearable
              menuPortalTarget={document.body}
              styles={selectStyles}
              value={supplierOptions.find((o) => o.value === values.supplierId) ?? null}
              onChange={(opt) => setFieldValue('supplierId', opt?.value ?? '')}
            />
            {!values.supplierId && (
              <div className="mt-2">
                <label className="block text-xs text-gray-400 mb-1">Or enter a new supplier name</label>
                <Field name="supplierName" type="text" placeholder="New supplier name..." className={inputCls} />
              </div>
            )}
          </div>

          {/* Serial + Warranty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Serial Number</label>
              <Field name="serialNumber" type="text" placeholder="Optional" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Warranty</label>
              <Field name="warranty" type="text" placeholder="e.g. 2 years" className={inputCls} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <Field as="textarea" name="description" rows={2} placeholder="Optional..." className={inputCls} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm text-white hover:bg-gray-50  hover:text-primary transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-full bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
