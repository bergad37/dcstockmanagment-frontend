import * as Yup from 'yup';
import type { ProductFormValues } from '../types/product';

export const productInitialValues: ProductFormValues = {
  id: null,
  name: '',
  type: 'item',
  description: '',
  warranty: '',
  categoryId: '',
  supplierId: '',
  quantity: null,
  serialNumber: '',
  costPrice: null,
  entryDate: ''
};

export const ProductSchema = Yup.object().shape({
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
  categoryId: Yup.string().required('Category is required'),
  serialNumber: Yup.string().nullable(),
  costPrice: Yup.number()
    .typeError('Cost price must be a number')
    .nullable()
    .min(0, 'Cost price must be positive'),
  quantity: Yup.number().when('type', (value: any, schema: any) =>
    value === 'quantity'
      ? schema
          .typeError('Quantity must be a number')
          .required('Quantity is required')
          .integer('Quantity must be a positive integer')
          .min(1, 'Quantity must be a positive integer')
      : schema.nullable()
  ),
  entryDate: Yup.string().required('Entry date is required')
});

export default ProductSchema;
