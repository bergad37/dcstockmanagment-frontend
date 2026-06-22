/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit2, Trash2 } from 'lucide-react';

export const productColumns = (actions: any, user: any) => [
  {
    name: 'Names',
    selector: (row: any) => row?.name,
    grow: 1,
  },
  {
    name: 'Serial Number',
    selector: (row: any) => row?.serialNumber,
    grow: 2,
  },
  {
    name: 'Category',
    selector: (row: any) => row?.category?.name ?? row?.category ?? '',
    grow: 1,
  },
  {
    name: 'Supplier',
    selector: (row: any) => row?.supplier?.name ?? '',
    grow: 1,
  },
  {
    name: 'Price',
    selector: (row: any) => {
      const p = row?.costPrice;
      if (p == null) return '';
      return typeof p === 'number' ? p : String(p);
    },
    grow: 1,
  },
  {
    name: 'Warranty',
    selector: (row: any) => row?.warranty ?? '---',
    grow: 1,
  },
  {
    name: 'Stock',
    selector: (row: any) => row?.stock?.quantity ?? 0,
    grow: 1,
  },
  {
    name: 'Actions',
    type: 'actions',
    cell: (row: any) =>
      user?.role === 'ADMIN' && (
        <div className="flex items-center gap-1.5">
          <button
            title="Edit"
            onClick={() => actions[0]?.handler(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition text-xs font-semibold"
          >
            <Edit2 size={12} />
          </button>
          <button
            title="Delete"
            onClick={() => actions[1]?.handler(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition text-xs font-semibold"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ),
    grow: 1,
  },
];
