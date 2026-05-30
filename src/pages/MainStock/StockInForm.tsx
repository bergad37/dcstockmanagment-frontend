import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useStockInStore } from '../../store/stockInStore';
import { useProductStore } from '../../store/productStore';
import { useSupplierStore } from '../../store/supplierStore';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const schema = Yup.object({
  productId: Yup.string().required('Product is required'),
  quantity: Yup.number()
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  supplierId: Yup.string().nullable(),
  unitCost: Yup.number().min(0, 'Cost must be positive').nullable(),
  invoiceNo: Yup.string(),
  receivedBy: Yup.string(),
  notes: Yup.string(),
  receivedAt: Yup.string(),
});

export default function StockInForm({ onClose, onSuccess }: Props) {
  const { createStockIn, createLoading } = useStockInStore();
  const { products, listProducts } = useProductStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    listProducts({ scope: 'MAIN_STOCK', limit: 100 });
    fetchSuppliers(undefined, 1, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSubmit = async (values: any) => {
    try {
      await createStockIn({
        productId: values.productId,
        supplierId: values.supplierId || null,
        quantity: Number(values.quantity),
        unitCost: values.unitCost ? Number(values.unitCost) : null,
        invoiceNo: values.invoiceNo || undefined,
        receivedBy: values.receivedBy || undefined,
        notes: values.notes || undefined,
        receivedAt: values.receivedAt || undefined,
      });
      toast.success('Stock-in recorded successfully');
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Failed to record stock-in');
    }
  };

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#073c56]';
  const errCls = 'text-red-500 text-xs mt-1';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <Formik
      initialValues={{
        productId: '',
        quantity: 1,
        supplierId: '',
        unitCost: '',
        invoiceNo: '',
        receivedBy: '',
        notes: '',
        receivedAt: new Date().toISOString().slice(0, 10),
      }}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4 p-1">
          {/* Product */}
          <div>
            <label className={labelCls}>Product *</label>
            <input
              type="text"
              placeholder="Search product..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className={`${inputCls} mb-1`}
            />
            <Field
              as="select"
              name="productId"
              className={`${inputCls} ${errors.productId && touched.productId ? 'border-red-400' : ''}`}
            >
              <option value="">— Select product —</option>
              {filteredProducts.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.stock?.quantity != null ? ` (${p.stock.quantity} in stock)` : ''}
                </option>
              ))}
            </Field>
            <ErrorMessage name="productId" component="div" className={errCls} />
          </div>

          {/* Quantity + Date side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Quantity Received *</label>
              <Field
                name="quantity"
                type="number"
                min={1}
                className={`${inputCls} ${errors.quantity && touched.quantity ? 'border-red-400' : ''}`}
              />
              <ErrorMessage name="quantity" component="div" className={errCls} />
            </div>
            <div>
              <label className={labelCls}>Date Received</label>
              <Field name="receivedAt" type="date" className={inputCls} />
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className={labelCls}>Supplier</label>
            <Field as="select" name="supplierId" className={inputCls}>
              <option value="">— None —</option>
              {(suppliers ?? []).map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Field>
          </div>

          {/* Unit Cost + Invoice */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Unit Cost (USD)</label>
              <Field name="unitCost" type="number" min={0} step="0.01" placeholder="0.00" className={inputCls} />
              <ErrorMessage name="unitCost" component="div" className={errCls} />
            </div>
            <div>
              <label className={labelCls}>Invoice #</label>
              <Field name="invoiceNo" type="text" placeholder="INV-2026-001" className={inputCls} />
            </div>
          </div>

          {/* Received By */}
          <div>
            <label className={labelCls}>Received By</label>
            <Field name="receivedBy" type="text" placeholder="Staff name" className={inputCls} />
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <Field
              as="textarea"
              name="notes"
              rows={2}
              placeholder="Optional notes..."
              className={inputCls}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-5 py-2 rounded-full bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition disabled:opacity-50"
            >
              {createLoading ? 'Saving...' : 'Record Stock In'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
