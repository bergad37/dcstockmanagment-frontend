import DataTable from 'react-data-table-component';
import { productCategoriesColumns } from '../../utils/columns/category.column';
import Button from '../../components/ui/Button';
import { useEffect, useState } from 'react';
import CategoryForm, { type InitialValuesType } from './categories.form';
import { useCategoryStore } from '../../store/categoriesStore';
import { Edit2, TrashIcon, Plus } from 'lucide-react';
import SupplierForm from './suppliers.form';
import { useSupplierStore } from '../../store/supplierStore';
import { ActionButtons } from '../../components/ui/ActionButtons';
import DeleteModal from '../../components/ui/ConfirmModal';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';

const Settings = () => {
  const { categories, fetchCategories, deleteCategory } = useCategoryStore();
  const { suppliers, fetchSuppliers, deleteSupplier } = useSupplierStore();
  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialValuesType>({
    id: null,
    name: ''
  });
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [supplierInitial, setSupplierInitial] = useState<any>({ id: null, name: '', phone: '', email: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteSupplierId, setDeleteSupplierId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, [fetchCategories, fetchSuppliers]);

  const deleteAction = (data: any) => {
    setDeleteItem(data.id);
    setShowDeleteModal(true);
  };

  const deleteSupplierAction = (data: any) => {
    setDeleteSupplierId(data.id);
    setShowDeleteModal(true);
  };

  const editAction = (data: any) => {
    setShowForm(true);
    setInitialValues({ id: data.id, name: data.name });
  };

  const editSupplierAction = (data: any) => {
    setShowSupplierForm(true);
    setSupplierInitial({ id: data.id, name: data.name, phone: data.phone, email: data.email });
  };

  const handleDelete = () => {
    if (deleteItem) {
      deleteCategory(deleteItem);
    }
    if (deleteSupplierId) {
      deleteSupplier(deleteSupplierId);
    }
  };

  const actions = [
    {
      icon: <Edit2 className="h-[20px] w-[20px] text-[#475467]" />,
      handler: editAction,
      label: 'Edit',
      plain: true
    },
    {
      icon: <TrashIcon className="h-[20px] w-[20px] text-[#475467]" />,
      handler: deleteAction,
      label: 'Delete',
      plain: true
    }
  ];

  const supplierActions = [
    {
      icon: <Edit2 className="h-[20px] w-[20px] text-[#475467]" />,
      handler: editSupplierAction,
      label: 'Edit',
      plain: true
    },
    {
      icon: <TrashIcon className="h-[20px] w-[20px] text-[#475467]" />,
      handler: deleteSupplierAction,
      label: 'Delete',
      plain: true
    }
  ];

  const handleClose = () => {
    setShowDeleteModal(false);
    setShowForm(false);
    setInitialValues({ id: null, name: '' });
    setShowSupplierForm(false);
    setSupplierInitial({ id: null, name: '', phone: '', email: '' });
  };

  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this department?"
        onConfirm={() => handleDelete()}
        onCancel={handleClose}
        loading={false}
      />

      <div className="w-full sm:p-6">
        {/* Top header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="px-4 py-1 text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
              Settings
            </h2>
          </div>
        </div>

        {/* Two-column: categories (left) and suppliers (right) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Categories */}
          {!showForm && (
            <div className="m-2 rounded-xl border border-[#EAECF0] bg-white">
              <div className="flex items-center justify-between px-4 py-4">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#073c56]">Configured Categories</h2>
                <Button label="Add category" onClick={() => setShowForm(true)} />
              </div>

              <div className="overflow-x-auto px-4 pb-4">
                {(categories ?? []).length > 0 && <SearchBar onSubmit={() => { }} />}
                <DataTable columns={productCategoriesColumns(actions)} data={categories ?? []} pagination paginationPerPage={5} fixedHeader responsive />
              </div>
            </div>
          )}

          {/* Suppliers */}
          <div className="m-2 rounded-xl border border-[#EAECF0] bg-white">
            <div className="flex items-center justify-between px-4 py-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#073c56]">Suppliers</h2>
              <button
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#073c56] text-white"
                onClick={() => {
                  setSupplierInitial({ id: null, name: '', phone: '', email: '' });
                  setShowSupplierForm(true);
                }}
              >
                <Plus className="h-4 w-4" /> <span>Add</span>
              </button>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              <SearchBar
                onSubmit={(value) => {
                  // call server-side search (query param 'q')
                  fetchSuppliers(value);
                }}
              />

              <DataTable
                columns={[
                  { name: 'Name', selector: (row: any) => row.name, sortable: true },
                  { name: 'Email', selector: (row: any) => row.email },
                  { name: 'Phone', selector: (row: any) => row.phone },
                  {
                    name: 'Actions',
                    cell: (row: any) => <div className="flex gap-2"><ActionButtons row={row} actions={supplierActions} /></div>
                  }
                ]}
                data={suppliers ?? []}
                pagination
                paginationPerPage={5}
                fixedHeader
                responsive
              />
            </div>
          </div>
        </div>

        <Modal
          isOpen={showForm}
          onClose={handleClose}
          title={'Add New Category'}
        >
          {' '}
          <CategoryForm
            handleClose={handleClose}
            initialValues={initialValues}
          />
        </Modal>

        <Modal isOpen={showSupplierForm} onClose={handleClose} title={supplierInitial?.id ? 'Edit Supplier' : 'Add Supplier'}>
          <SupplierForm handleClose={handleClose} initialValues={supplierInitial} />
        </Modal>
      </div>
    </>
  );
};

export default Settings;
