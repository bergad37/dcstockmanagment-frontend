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
  { name: 'Category', selector: (row: any) => row?.category },
  { name: 'Supplier', selector: (row: any) => row?.address },

  {
    name: 'Price',
    selector: (row: any) => row?.costPrice
  },
  //  if available it should be available in stock if not it should not be in stok
  {
    name: 'Warranty',
    selector: (row: any) => row?.warranty ?? ''
  },
  {
    name: 'Actions',
    type: 'actions',
    cell: (row: any) => [
      <ActionButtons row={row} key={row?.id} actions={actions} />
    ]
  }
];
