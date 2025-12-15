import type { StockTransaction } from '../../api/stockApi';
import Button from '../../components/ui/Button';
import ReturnItemModal from '../../components/ReturnItemModal';
import { useState } from 'react';
import { useStockStore } from '../../store/stockStore';

interface StockOutColumnDef {
  name: string;
  selector: (row: StockTransaction) => unknown;
  sortable?: boolean;
  cell?: (row: StockTransaction) => React.ReactNode;
}

interface InventoryColumnDef {
  name: string;
  selector: (row: StockTransaction) => unknown;
  sortable?: boolean;
  cell?: (row: StockTransaction) => React.ReactNode;
}

const ReturnButton = ({ row }: { row: StockTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { markAsReturned } = useStockStore();

  const handleReturn = async (returnDate: string) => {
    try {
      await markAsReturned(row.id, returnDate);
      // Note: The store will update the status and return date
    } catch (error) {
      console.error('Failed to return item:', error);
    }
  };

  if (row.type !== 'RENTED' || row.status === 'RETURNED') {
    return <span className="text-gray-400">-</span>;
  }

  return (
    <>
      <Button
        label="Return Item"
        onClick={() => setIsModalOpen(true)}
        bg="bg-green-600"
        className="py-1 px-3 text-xs hover:bg-green-700"
      />
      <ReturnItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReturn}
        productName={row.productName}
      />
    </>
  );
};

export const stockOutColumns: StockOutColumnDef[] = [
  {
    name: 'Product',
    selector: (row: StockTransaction) => row.productName,
    sortable: true
  },
  {
    name: 'Type',
    selector: (row: StockTransaction) => row.type,
    sortable: true,
    cell: (row: StockTransaction) => (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.type === 'SOLD'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-amber-100 text-amber-800'
        }`}
      >
        {row.type}
      </span>
    )
  },
  {
    name: 'Client Name',
    selector: (row: StockTransaction) => row.clientName,
    sortable: true
  },
  {
    name: 'Client Email',
    selector: (row: StockTransaction) => row.clientEmail,
    cell: (row: StockTransaction) => (
      <a
        href={`mailto:${row.clientEmail}`}
        className="text-blue-600 hover:underline text-sm"
      >
        {row.clientEmail}
      </a>
    )
  },
  {
    name: 'Quantity',
    selector: (row: StockTransaction) => row.quantity,
    sortable: true
  },
  {
    name: 'Date',
    selector: (row: StockTransaction) => row.transactionDate,
    sortable: true,
    cell: (row: StockTransaction) => {
      const date = new Date(row.transactionDate);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  },
  {
    name: 'Return Date',
    selector: (row: StockTransaction) => row.returnDate || '',
    cell: (row: StockTransaction) => {
      if (!row.returnDate) return <span className="text-gray-400">-</span>;
      const date = new Date(row.returnDate);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  },
  {
    name: 'Status',
    selector: (row: StockTransaction) => row.status || 'COMPLETED',
    cell: (row: StockTransaction) => {
      const status = row.status || 'COMPLETED';
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : status === 'RETURNED'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {status}
        </span>
      );
    }
  },
  {
    name: 'Action',
    selector: (row: StockTransaction) => row.id,
    cell: (row: StockTransaction) => <ReturnButton row={row} />
  }
];

export const inventoryColumns: InventoryColumnDef[] = [
  {
    name: 'Product Name',
    selector: (row: StockTransaction) => row.productName,
    sortable: true
  },
  {
    name: 'In Stock',
    selector: (row: StockTransaction) => row.quantity,
    sortable: true,
    cell: (row: StockTransaction) => (
      <span className="font-semibold text-lg text-[#073c56]">
        {row.quantity}
      </span>
    )
  },
  {
    name: 'Product ID',
    selector: (row: StockTransaction) => row.productId,
    cell: (row: StockTransaction) => (
      <span className="text-gray-500 text-xs">{row.productId}</span>
    )
  }
];
