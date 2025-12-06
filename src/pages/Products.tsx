import { useEffect, useState } from 'react';
import { useProductStore } from '../store/productStore';
import ProductForm, { type InitialValuesType } from './Products/product.form';
import DataTable from 'react-data-table-component';
import Button from '../components/ui/Button';
import { Edit2, TrashIcon } from 'lucide-react';
import DeleteModal from '../components/ui/ConfirmModal';
import { productColumns } from '../utils/columns/products.column';
const Products = () => {
  const { listProducts } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialValuesType>({
    id: null,
    name: '',
    description: '',
    warranty: '',
    category: '',
    serialNumber: '',
    costPrice: ''
  });

  const products = [
    {
      id: 'a3f9c2d4-6e71-4bf7-9c4d-1b4f92a0f7e1',
      name: 'HP EliteBook 840 G5',
      description: 'High-performance business laptop with Intel i7 processor.',
      warranty: '12 months',
      category: 'Electronics',
      serialNumber: 'HP-840G5-2025-001',
      costPrice: 850
    },
    {
      id: 'c9b7f61a-3394-4dc2-92a8-6d5e0795adbd',
      name: 'Office Desk – Walnut',
      description: 'Sturdy executive desk made from walnut wood.',
      warranty: '6 months',
      category: 'Furniture',
      serialNumber: 'DESK-WAL-88421',
      costPrice: 130
    },
    {
      id: 'f219d7ac-1d1d-4a1f-bd5e-34f9b4d2b0f8',
      name: 'TP-Link Archer C6 Router',
      description: 'Dual-band Wi-Fi router with strong signal coverage.',
      warranty: '12 months',
      category: 'Networking',
      serialNumber: 'TPL-C6-99872',
      costPrice: 45
    },
    {
      id: '8c41b18c-6d19-4a6a-9673-f7e33c61e9d0',
      name: "Dell 24'' Monitor",
      description: 'Full HD LED monitor ideal for office use.',
      warranty: '12 months',
      category: 'Electronics',
      serialNumber: 'DELL-24FHD-75629',
      costPrice: 160
    },
    {
      id: '5e7d3b6c-8e2a-4c70-bdc3-3ad4d0fe2d33',
      name: 'Ergonomic Office Chair',
      description: 'Adjustable height chair with lumbar support.',
      warranty: '6 months',
      category: 'Furniture',
      serialNumber: 'CHAIR-ERG-42119',
      costPrice: 75
    }
  ];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    listProducts();
  }, [listProducts]);

  const deleteAction = (data: any) => {
    setDeleteItem(data.id);
    setShowDeleteModal(true);
  };

  const editAction = (data: any) => {
    setShowForm(true);
    setInitialValues({
      id: data.id,
      name: data.name,
      description: data.description || '',
      warranty: data.warranty || '',
      category: data.category || '',
      serialNumber: data.serialNumber || '',
      costPrice: data.costPrice || ''
    });
  };

  //   const handleDelete = () => {
  //     if (deleteItem) {
  //       deleteCategory(deleteItem);
  //     }
  //   };
  const actions = [
    {
      icon: <Edit2 className="h-[20px] w-[20px] text-[#475467]" />,
      handler: editAction,
      label: 'Edit'
    },
    {
      icon: <TrashIcon className="h-[20px] w-[20px] text-[#475467]" />,
      handler: deleteAction,
      label: 'Delete'
    }
  ];

  const handleClose = () => {
    setShowDeleteModal(false);
    setShowForm(false);
  };

  console.log('#########', deleteItem);
  return (
    <div>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this department?"
        onConfirm={() => console.log('Delete item')}
        onCancel={handleClose}
        loading={false}
      />
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
          Products
        </h2>
        <p className="py-2 text-sm text-gray-600">
          Manage and view all products in the stock.
        </p>
      </div>

      {!showForm && (
        <div className="w-full  m-2 rounded-xl border border-[#EAECF0] bg-white">
          {/* Header row (Responsive) */}
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-2 px-4 py-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#073c56]">
              Registered products
            </h2>

            <Button
              label="Add New product"
              onClick={() => setShowForm(true)}
              className="self-start sm:self-auto"
            />
          </div>

          {/* Table wrapper for horizontal scrolling on mobile */}
          <div className="overflow-x-auto">
            <DataTable
              columns={productColumns(actions)}
              data={products}
              pagination
              paginationPerPage={5}
              fixedHeader
              responsive
            />
          </div>
        </div>
      )}

      {showForm && (
        <ProductForm handleClose={handleClose} initialValues={initialValues} />
      )}
    </div>
  );
};

export default Products;
