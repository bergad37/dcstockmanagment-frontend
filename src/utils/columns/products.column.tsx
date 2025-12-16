/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionButtons } from '../../components/ui/ActionButtons';

export const productColumns = (actions: any) => [
  {
    name: 'Names',
    selector: (row: any) => row?.name
  },
  {
    name: 'Serial Number',
    selector: (row: any) => row?.serialNumber
  },
  {
    name: 'Category',
    selector: (row: any) => row?.category?.name ?? row?.category ?? ''
  },
  { name: 'Supplier', selector: (row: any) => row?.supplier?.name ?? '' },

  {
    name: 'Price',
    selector: (row: any) => {
      const p = row?.costPrice;
      if (p == null) return '';
      return typeof p === 'number' ? p : String(p);
    }
  },
  //  if available it should be available in stock if not it should not be in stok
  {
    name: 'Warranty',
    selector: (row: any) => row?.warranty ?? ''
  },
  {
    name: 'Stock',
    selector: (row: any) => row?.stock?.quantity ?? 0
  },
  {
    name: 'Actions',
    type: 'actions',
    cell: (row: any) => (
      <ActionButtons row={row} key={row?.id} actions={actions} />
    )
  }
];
