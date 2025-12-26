'use client';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { productCategoriesColumns } from '../../utils/columns/category.column';
import CategoryForm, { type InitialValuesType } from './categories.form';
import { useCategoryStore } from '../../store/categoriesStore';
import SupplierForm from './suppliers.form';
import { useSupplierStore } from '../../store/supplierStore';
import { Edit2, TrashIcon, Plus, Search, X } from 'lucide-react';
import { ActionButtons } from '../../components/ui/ActionButtons';
import DeleteModal from '../../components/ui/ConfirmModal';
import Modal from '../../components/ui/Modal';
import { toast } from 'sonner';

const Settings = () => {
  const { categories, fetchCategories, deleteCategory, loading: categoryLoading, success: categorySuccess, errorCategory } = useCategoryStore();
  const { suppliers, fetchSuppliers, deleteSupplier, loading: supplierLoading, success: supplierSuccess, errorSupplier } = useSupplierStore();

  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialValuesType>({ id: null, name: '' });
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [supplierInitial, setSupplierInitial] = useState<any>({ id: null, name: '', phone: '', email: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const [deleteSupplierId, setDeleteSupplierId] = useState<string | null>(null);

  // Search States
  const [categorySearch, setCategorySearch] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, [fetchCategories, fetchSuppliers]);

  useEffect(() => {
    if (categorySuccess || errorCategory) { fetchCategories(); }
  }, [categorySuccess, errorCategory]);

  useEffect(() => {
    if (supplierSuccess || errorSupplier) fetchSuppliers();
  }, [supplierSuccess, errorSupplier]);
  useEffect(() => {
    const q = supplierSearch?.trim() ?? '';
    const timer = setTimeout(() => {
      void fetchSuppliers(q || undefined);
    }, 350);
    return () => clearTimeout(timer);
  }, [supplierSearch, fetchSuppliers]);

  useEffect(() => {
    const q = categorySearch?.trim() ?? '';
    const timer = setTimeout(() => {
      void fetchCategories(q || undefined);
    }, 350);
    return () => clearTimeout(timer);
  }, [categorySearch, fetchCategories]);

  useEffect(() => {
    if (errorCategory) toast.error(errorCategory);
  }, [errorCategory]);

  useEffect(() => {
    if (errorSupplier) toast.error(errorSupplier);
  }, [errorSupplier]);

  const handleClose = () => {
    setShowDeleteModal(false);
    setShowForm(false);
    setShowSupplierForm(false);
    setInitialValues({ id: null, name: '' });
    setSupplierInitial({ id: null, name: '', phone: '', email: '' });
    setDeleteItem(null);
    setDeleteSupplierId(null);
  };

  const deleteAction = (data: any) => { setDeleteItem(data.id); setShowDeleteModal(true); };
  const deleteSupplierAction = (data: any) => { setDeleteSupplierId(data.id); setShowDeleteModal(true); };
  const editAction = (data: any) => { setShowForm(true); setInitialValues({ id: data.id, name: data.name }); };
  const editSupplierAction = (data: any) => { setShowSupplierForm(true); setSupplierInitial({ id: data.id, name: data.name, phone: data.phone, email: data.email }); };

  const handleDelete = () => {
    const doDelete = async () => {
      try {
        if (deleteItem) {
          const res = await deleteCategory(deleteItem);
          const message = res?.data?.message || res?.data?.msg || res?.data?.data?.message || 'Category deleted successfully';
          const success = res?.data?.success ?? res?.data?.sucess ?? (res?.status >= 200 && res?.status < 300);
          if (!success) { handleClose(); return; }
          toast.success(message);
        }
        if (deleteSupplierId) {
          const res = await deleteSupplier(deleteSupplierId);
          const message = res?.data?.message || res?.data?.msg || res?.data?.data?.message || 'Supplier deleted successfully';
          const success = res?.data?.success ?? res?.data?.sucess ?? (res?.status >= 200 && res?.status < 300);
          if (!success) { handleClose(); return; }
          toast.success(message);
        }
        handleClose();
      } catch { handleClose(); }
    };
    void doDelete();
  };

  const actions = [
    { icon: <Edit2 className="h-[18px] w-[18px] text-[#475467]" />, handler: editAction, label: 'Edit', plain: true },
    { icon: <TrashIcon className="h-[18px] w-[18px] text-[#DC2626]" />, handler: deleteAction, label: 'Delete', plain: true }
  ];

  const supplierActions = [
    { icon: <Edit2 className="h-[18px] w-[18px] text-[#475467]" />, handler: editSupplierAction, label: 'Edit', plain: true },
    { icon: <TrashIcon className="h-[18px] w-[18px] text-[#DC2626]" />, handler: deleteSupplierAction, label: 'Delete', plain: true }
  ];

  // Use server-provided lists; search triggers server-side fetches
  const filteredCategories = categories ?? [];
  const filteredSuppliers = suppliers ?? [];

  const loadingSkeleton = (
    <div className="flex justify-center items-center py-12">
      <div className="animate-pulse space-y-3 w-full px-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg"
            style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );

  const isCategoryFetching = categoryLoading && !deleteItem;
  const isSupplierFetching = supplierLoading && !deleteSupplierId;

  const enhancedTableStyles = {
    headRow: {
      style: {
        backgroundColor: '#F9FAFB',
        borderBottom: '2px solid #E5E7EB',
        minHeight: '52px',
        fontWeight: '600',
        fontSize: '13px',
        color: '#374151',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    rows: {
      style: {
        minHeight: '60px',
        fontSize: '14px',
        color: '#1F2937',
        borderBottom: '1px solid #F3F4F6',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#F9FAFB',
          transform: 'scale(1.001)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    pagination: {
      style: {
        borderTop: '1px solid #E5E7EB',
        minHeight: '56px',
        fontSize: '13px',
        color: '#6B7280',
      },
      pageButtonsStyle: {
        borderRadius: '6px',
        height: '36px',
        width: '36px',
        padding: '4px',
        margin: '0 4px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: 'transparent',
        '&:hover:not(:disabled)': {
          backgroundColor: '#073c56',
          color: 'white',
        },
        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 0.4,
        },
      },
    },
  };

  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={handleClose}
        loading={deleteItem ? categoryLoading : deleteSupplierId ? supplierLoading : false}
      />

      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 lg:p-1">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#073c56] tracking-tight">
                Settings
              </h1>
              <p className="text-sm text-gray-600 mt-1">Manage your categories and suppliers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Categories Section */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#073c56] to-[#0a5273] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Product Categories</h2>
                  <p className="text-sm text-blue-100 mt-1">
                    {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#073c56] font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-12 pr-16 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-200 outline-none transition-all duration-200 text-sm bg-white"
                />
                {categorySearch && (
                  <div
                    onClick={() => setCategorySearch('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-lg px-3 py-2 transition-all duration-200"
                  >
                    <X className="h-5 w-5 text-slate-900" />
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <DataTable
                columns={productCategoriesColumns(actions)}
                data={filteredCategories}
                pagination
                paginationPerPage={8}
                fixedHeader
                responsive
                customStyles={enhancedTableStyles}
                progressPending={isCategoryFetching}
                progressComponent={loadingSkeleton}
                conditionalRowStyles={[
                  {
                    when: () => !!deleteItem,
                    style: { opacity: 0.5, pointerEvents: 'none', backgroundColor: '#FEF2F2' }
                  }
                ]}
                noDataComponent={
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No categories found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new category</p>
                  </div>
                }
              />
            </div>
          </div>

          {/* Suppliers Section */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a5273] to-[#073c56] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Suppliers</h2>
                  <p className="text-sm text-blue-100 mt-1">
                    {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'supplier' : 'suppliers'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSupplierInitial({ id: null, name: '', phone: '', email: '' });
                    setShowSupplierForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#073c56] font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Supplier</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      void fetchSuppliers(supplierSearch?.trim() || undefined);
                    }
                  }}
                  className="w-full pl-12 pr-16 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-200 outline-none transition-all duration-200 text-sm bg-white"
                />
                {supplierSearch && (
                  <div
                    onClick={() => setSupplierSearch('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-lg px-3 py-2 transition-all duration-200"
                  >
                    <X className="h-5 w-5 text-slate-900" />
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <DataTable
                columns={[
                  {
                    name: 'Name',
                    selector: (row: any) => row.name,
                    sortable: true,
                    cell: (row: any) => (
                      <div className="font-medium text-gray-900">{row.name}</div>
                    )
                  },
                  {
                    name: 'Email',
                    selector: (row: any) => row.email,
                    cell: (row: any) => (
                      <div className="text-gray-600 text-sm">{row.email}</div>
                    )
                  },
                  {
                    name: 'Phone',
                    selector: (row: any) => row.phone,
                    cell: (row: any) => (
                      <div className="text-gray-600 text-sm font-mono">{row.phone}</div>
                    )
                  },
                  {
                    name: 'Actions',
                    cell: (row: any) => (
                      <ActionButtons
                        row={row}
                        actions={supplierActions}
                        disabled={!!deleteSupplierId}
                      />
                    ),
                    right: true
                  }
                ]}
                data={filteredSuppliers}
                pagination
                paginationPerPage={8}
                fixedHeader
                responsive
                customStyles={enhancedTableStyles}
                progressPending={isSupplierFetching}
                progressComponent={loadingSkeleton}
                conditionalRowStyles={[
                  {
                    when: () => !!deleteSupplierId,
                    style: { opacity: 0.5, pointerEvents: 'none', backgroundColor: '#FEF2F2' }
                  }
                ]}
                noDataComponent={
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No suppliers found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new supplier</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal isOpen={showForm} onClose={handleClose} title={initialValues.id ? "Edit Category" : "Add New Category"}>
          <CategoryForm handleClose={() => { handleClose(); fetchCategories(); }} initialValues={initialValues} />
        </Modal>

        <Modal isOpen={showSupplierForm} onClose={handleClose} title={supplierInitial?.id ? 'Edit Supplier' : 'Add Supplier'}>
          <SupplierForm handleClose={() => { handleClose(); fetchSuppliers(); }} initialValues={supplierInitial} />
        </Modal>
      </div>

    </>
  );
};

export default Settings;