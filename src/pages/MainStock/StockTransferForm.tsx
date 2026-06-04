import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { ArrowRightLeft, Search } from 'lucide-react';
import { useStockTransferStore } from '../../store/stockTransferStore';
import { useProductStore } from '../../store/productStore';

interface Props {
  /** The Main Stock product being transferred from */
  product: {
    id: string;
    name: string;
    stock?: { quantity: number };
    type?: string;
    category?: { name: string };
  };
  onClose: () => void;
  onSuccess: () => void;
}

const schema = Yup.object({
  quantity: Yup.number()
    .min(1, 'Minimum 1')
    .required('Quantity is required'),
  target: Yup.string().oneOf(['existing', 'new']).required(),
  miniStockProductId: Yup.string().when('target', {
    is: 'existing',
    then: (s) => s.required('Please select a Mini Stock product'),
    otherwise: (s) => s.nullable(),
  }),
  notes: Yup.string(),
  transferredBy: Yup.string(),
});

export default function StockTransferForm({ product, onClose, onSuccess }: Props) {
  const { createTransfer, createLoading: loading } = useStockTransferStore();
  const { products: miniProducts, listProducts } = useProductStore();
  const [miniSearch, setMiniSearch] = useState('');

  const available = product.stock?.quantity ?? 0;

  // Load mini stock products for the "existing" option
  useEffect(() => {
    listProducts({ scope: 'MINI_STOCK', limit: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMini = miniProducts.filter((p: any) =>
    p.name.toLowerCase().includes(miniSearch.toLowerCase())
  );

  const handleSubmit = async (values: any) => {
    if (Number(values.quantity) > available) {
      toast.error(`Cannot transfer more than available stock (${available})`);
      return;
    }

    try {
      await createTransfer({
        mainStockProductId: product.id,
        miniStockProductId:
          values.target === 'existing' ? values.miniStockProductId : null,
        quantity: Number(values.quantity),
        notes: values.notes || undefined,
        transferredBy: values.transferredBy || undefined,
      });
      toast.success(`${values.quantity} unit(s) transferred to Mini Stock`);
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Transfer failed');
    }
  };

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#073c56]';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const errCls = 'text-red-500 text-xs mt-1';

  return (
    <Formik
      initialValues={{
        quantity: 1,
        target: 'new',
        miniStockProductId: '',
        notes: '',
        transferredBy: '',
      }}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched }) => (
        <Form className="space-y-4 p-1">
          {/* Source info */}
          <div className="rounded-xl bg-[#073c56]/5 border border-[#073c56]/10 px-4 py-3 flex items-start gap-3">
            <ArrowRightLeft size={18} className="text-[#073c56] mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-[#073c56]">{product.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {product.category?.name} · {available} available in Main Stock
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className={labelCls}>
              Quantity to Transfer *
              <span className="ml-2 text-xs text-gray-400 font-normal">
                (max {available})
              </span>
            </label>
            <Field
              name="quantity"
              type="number"
              min={1}
              max={available}
              className={`${inputCls} ${errors.quantity && touched.quantity ? 'border-red-400' : ''}`}
            />
            <ErrorMessage name="quantity" component="div" className={errCls} />
          </div>

          {/* Target toggle */}
          <div>
            <label className={labelCls}>Where should it go in Mini Stock?</label>
            <div className="flex gap-3">
              {[
                { value: 'new', label: 'Create new Mini Stock entry' },
                { value: 'existing', label: 'Add to existing product' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex-1 flex items-center gap-2 border rounded-xl px-4 py-3 cursor-pointer text-sm transition ${
                    values.target === opt.value
                      ? 'border-[#073c56] bg-[#073c56]/5 font-medium text-[#073c56]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Field type="radio" name="target" value={opt.value} className="accent-[#073c56]" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* If existing: product picker */}
          {values.target === 'existing' && (
            <div>
              <label className={labelCls}>Select Mini Stock Product *</label>
              <div className="relative mb-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mini stock products..."
                  value={miniSearch}
                  onChange={(e) => setMiniSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#073c56]"
                />
              </div>
              <Field
                as="select"
                name="miniStockProductId"
                className={`${inputCls} ${
                  errors.miniStockProductId && touched.miniStockProductId
                    ? 'border-red-400'
                    : ''
                }`}
              >
                <option value="">— Select product —</option>
                {filteredMini.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.stock?.quantity != null ? ` · ${p.stock.quantity} in stock` : ''}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="miniStockProductId" component="div" className={errCls} />
            </div>
          )}

          {/* If new: info note */}
          {values.target === 'new' && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700">
              A new Mini Stock product will be created automatically using the same name,
              category, and details as <strong>{product.name}</strong>. You can edit it
              in the Mini Stock portal afterwards.
            </div>
          )}

          {/* Transferred by */}
          <div>
            <label className={labelCls}>Transferred By</label>
            <Field
              name="transferredBy"
              type="text"
              placeholder="Staff name (optional)"
              className={inputCls}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <Field
              as="textarea"
              name="notes"
              rows={2}
              placeholder="Optional reason or notes..."
              className={inputCls}
            />
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
              disabled={loading || available === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition disabled:opacity-50"
            >
              <ArrowRightLeft size={14} />
              {loading ? 'Transferring...' : 'Transfer to Mini Stock'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
