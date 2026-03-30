/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionButtons } from '../../components/ui/ActionButtons';

export const productColumns = (actions: any, user: any) => [
  {
    name: 'Names',
    selector: (row: any) => row?.name,
    grow: 1
  },
  {
    name: 'Serial Number',
    selector: (row: any) => row?.serialNumber,
    grow: 2
  },
  {
    name: 'Category',
    selector: (row: any) => row?.category?.name ?? row?.category ?? '',
    grow: 1
  },
  {
    name: 'Supplier',
    selector: (row: any) => row?.supplier?.name ?? '',
    grow: 1
  },
  {
    name: 'Price',
    selector: (row: any) => {
      const p = row?.costPrice;
      if (p == null) return '';
      return typeof p === 'number' ? p : String(p);
    },
    grow: 1
  },
  {
    name: 'Warranty',
    selector: (row: any) => row?.warranty ?? '---',
    grow: 1 
  },
  {
    name: 'Stock',
    selector: (row: any) => row?.stock?.quantity ?? 0,
    grow: 1
  },
  user?.role === 'ADMIN' && {
    name: 'Actions',
    type: 'actions',
    cell: (row: any) => (
      <ActionButtons row={row} key={row?.id} actions={actions} />
    ),
    grow: 1
  }
];