import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoriesStore';
import { useSupplierStore } from '../../store/supplierStore';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const schema = Yup.object({
  name: Yup.string().required('Product name is required'),
  categoryId: Yup.string().required('Category is required'),
  type: Yup.string()
    .oneOf(['ITEM', 'QUANTITY', 'CALIBRATION'])
    .required('Type is required'),
  quantity: Yup.number()
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  supplierId: Yup.string().nullable(),
  supplierName: Yup.string(),
  costPrice: Yup.number().min(0).nullable(),
  serialNumber: Yup.string(),
  warranty: Yup.string(),
  description: Yup.string(),
});

export default function MainStockProductForm({ onClose, onSuccess }: Props) {
  const { createProduct, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();

  useEffect(() => {
    fetchCategories();
    fetchSuppliers(undefined, 1, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      await createProduct({
        ...values,
        scope: 'MAIN_STOCK',
        quantity: Number(values.quantity),
        costPrice: values.costPrice ? Number(values.costPrice) : null,
        supplierId: values.supplierId || null,
        supplierName: values.supplierName || undefined,
        entryDate: new Date().toISOString(),
      });
      toast.success('Product added to Main Stock');
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Failed to create product');
    }
  };

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#073c56]';
  const errCls = 'text-red-500 text-xs mt-1';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <Formik
      initialValues={{
        name: '',
        categoryId: '',
        type: 'QUANTITY',
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
      {({ errors, touched, values }) => (
        <Form className="space-y-4 p-1">
          {/* Name */}
          <div>
            <label className={labelCls}>Product Name *</label>
            <Field
              name="name"
              type="text"
              placeholder="e.g. Total Station TS06"
              className={`${inputCls} ${errors.name && touched.name ? 'border-red-400' : ''}`}
            />
            <ErrorMessage name="name" component="div" className={errCls} />
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <Field
                as="select"
                name="categoryId"
                className={`${inputCls} ${errors.categoryId && touched.categoryId ? 'border-red-400' : ''}`}
              >
                <option value="">— Select category —</option>
                {categories?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Field>
              <ErrorMessage name="categoryId" component="div" className={errCls} />
            </div>
            <div>
              <label className={labelCls}>Type *</label>
              <Field
                as="select"
                name="type"
                className={`${inputCls} ${errors.type && touched.type ? 'border-red-400' : ''}`}
              >
                <option value="QUANTITY">QUANTITY</option>
                <option value="ITEM">ITEM</option>
                <option value="CALIBRATION">CALIBRATION</option>
              </Field>
              <ErrorMessage name="type" component="div" className={errCls} />
            </div>
          </div>

          {/* Quantity + Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Initial Quantity *</label>
              <Field
                name="quantity"
                type="number"
                min={values.type === 'ITEM' ? 1 : 1}
                max={values.type === 'ITEM' ? 1 : undefined}
                className={`${inputCls} ${errors.quantity && touched.quantity ? 'border-red-400' : ''}`}
              />
              <ErrorMessage name="quantity" component="div" className={errCls} />
            </div>
            <div>
              <label className={labelCls}>Unit Cost (USD)</label>
              <Field name="costPrice" type="number" min={0} step="0.01" placeholder="0.00" className={inputCls} />
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className={labelCls}>Supplier</label>
            <Field as="select" name="supplierId" className={inputCls}>
              <option value="">— Select existing supplier —</option>
              {(suppliers ?? []).map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Field>
            <p className="text-xs text-gray-400 mt-1">
              Or enter a new supplier name below (will be created automatically)
            </p>
            <Field
              name="supplierName"
              type="text"
              placeholder="New supplier name..."
              className={`${inputCls} mt-1`}
              disabled={!!values.supplierId}
            />
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
              className="px-4 py-2 rounded-full border border-gray-300 text-sm  text-white hover:bg-gray-50 hover:text-primary transition"
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
