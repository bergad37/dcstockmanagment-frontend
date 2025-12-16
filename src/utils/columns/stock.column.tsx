/* eslint-disable @typescript-eslint/no-explicit-any */
import Badge from '../../components/Badge';
import { ActionButtons } from '../../components/ui/ActionButtons';

export const stockColumns = (actions?: any) => [
  {
    name: 'Product Name',
    selector: (row: any) => row?.name,
    sortable: true
  },
  {
    name: 'Category',
    selector: (row: any) => row?.category,
    sortable: true
  },
  {
    name: 'Quantity',
    selector: (row: any) => row?.quantity ?? 0,
    sortable: true,
    cell: (row: any) => (
      <span className="font-semibold text-[#073c56]">{row?.quantity ?? 0}</span>
    )
  },
  {
    name: 'Status',
    selector: (row: any) => row?.quantity,
    cell: (row: any) => {
      const quantity = row?.quantity ?? 0;
      if (quantity === 0) {
        return <Badge label="Out of Stock" variant="danger" />;
      } else if (quantity < 3) {
        return <Badge label="Low Stock" variant="warning" />;
      } else {
        return <Badge label="In Stock" variant="success" />;
      }
    }
  },
  {
    name: 'Serial Number',
    selector: (row: any) => row?.serialNumber ?? '-'
  },
  {
    name: 'Cost Price',
    selector: (row: any) => row?.costPrice,
    cell: (row: any) => (
      <span>${row?.costPrice?.toFixed(2) ?? '0.00'}</span>
    )
  },
  {
    name: 'Total Value',
    selector: (row: any) => row?.quantity * row?.costPrice,
    cell: (row: any) => {
      const totalValue = (row?.quantity ?? 0) * (row?.costPrice ?? 0);
      return <span className="font-semibold">${totalValue.toFixed(2)}</span>;
    }
  },
  ...(actions
    ? [
      {
        name: 'Actions',
        type: 'actions',
        cell: (row: any) => (
          <ActionButtons row={row} key={row?.id} actions={actions} />
        )
      }
    ]
    : [])
];

