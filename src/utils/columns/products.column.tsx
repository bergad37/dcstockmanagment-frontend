import { ActionButtons } from '../../components/ui/ActionButtons';

export const productColumns = (actions: any) => [
  {
    name: 'Names',
    selector: (row) => row?.name
  },
  {
    name: 'Serial Number',
    selector: (row) => row?.serialNumber
  },
  { name: 'Category', selector: (row) => row?.category },
  { name: 'Supplier', selector: (row) => row?.address },

  {
    name: 'Price',
    selector: (row) => row?.costPrice
  },
  //  if available it should be available in stock if not it should not be in stok
  {
    name: 'Warranty',
    selector: (row) => row?.warranty ?? ''
  },
  {
    name: 'Actions',
    type: 'actions',
    cell: (row) => [<ActionButtons row={row} key={row?.id} actions={actions} />]
  }
];
