import DataTable from 'react-data-table-component';
import Button from '../../components/ui/Button';
import { customerColumns } from '../../utils/columns/customer.column';
import { useEffect, useState } from 'react';
import type { CustomerInitialValues } from './clients.form';
import { Edit2, TrashIcon, Users, Plus } from 'lucide-react';
import CustomerForm from './clients.form';
import { useCustomerStore } from '../../store/CustomerStore';
import { toast } from 'sonner';
import DeleteModal from '../../components/ui/ConfirmModal';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import { customStyles } from '../../utils/ui.helper.styles';

const Clients = () => {
  const { fetchCustomer, deleteCustomer, customers, loading, pagination, error } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] = useState<CustomerInitialValues>({
    id: null,
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    void fetchCustomer(pagination.page, pagination.limit, '');
  }, [fetchCustomer]);

  useEffect(() => {
    const q = searchTerm?.trim() ?? '';
    const timer = setTimeout(() => {
      void fetchCustomer(1, pagination.limit, q);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchCustomer, pagination.limit]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const deleteAction = (data: any) => {
    setDeleteItem(data.id);
    setShowDeleteModal(true);
  };

  const editAction = (data: CustomerInitialValues) => {
    setShowForm(true);
    setInitialValues({
      id: data.id,
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone
    });
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await deleteCustomer(deleteItem);
    if (res.success) {
      toast.success(res.message || 'Customer deleted');
      setShowDeleteModal(false);
      setDeleteItem(null);
    } else {
      toast.error(res.message || 'Failed to delete customer');
    }
  };

  const actions = [
    {
      icon: <Edit2 className="h-[18px] w-[18px] text-primary" />,
      handler: editAction,
      label: 'Edit'
    },
    {
      icon: <TrashIcon className="h-[18px] w-[18px] text-red-600" />,
      handler: deleteAction,
      label: 'Delete'
    }
  ];

  const handleClose = () => {
    setShowDeleteModal(false);
    setShowForm(false);
    setInitialValues({
      id: null,
      name: '',
      email: '',
      address: '',
      phone: ''
    });
  };

  // Custom subheader component with search
  const SubHeaderComponent = () => (
    <div className="w-full px-4 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span className="font-medium">
            {pagination.total || 0} {pagination.total === 1 ? 'Client' : 'Clients'}
          </span>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[320px]">
          <SearchBar
            placeholder="Search by name, email, or phone..."
            onChange={(v) => setSearchTerm(v)}
            onSubmit={(v) => void fetchCustomer(1, pagination.limit, v)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this client? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={handleClose}
        loading={loading && !!deleteItem}
      />

      <div className="min-h-screen bg-gradient-to-br  to-slate-50 p-4 sm:p-6 lg:p-1">
        {!showForm && (
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Title with Icon */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary shadow-lg shadow-blue-500/30">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                      Clients Directory
                    </h1>
                    <p className="mt-2 text-base text-gray-600">
                      Manage and organize all your client relationships
                    </p>
                  </div>
                </div>

                {/* Add Client Button */}
                <Button
                  label="Add Client"
                  onClick={() => setShowForm(true)}
                />
              </div>
            </div>

            {/* Data Table Section with integrated search */}
            <div className="bg-white rounded-2xl shadow-xl border  overflow-hidden">
              <DataTable
                columns={customerColumns(actions)}
                data={customers}
                pagination
                customStyles={customStyles}
                paginationServer
                paginationPerPage={pagination.limit}
                paginationTotalRows={pagination.total}
                onChangePage={(page) => fetchCustomer(page, pagination.limit, searchTerm)}
                onChangeRowsPerPage={(newPerPage, page) =>
                  fetchCustomer(page, newPerPage, searchTerm)
                }
                progressPending={loading}
                fixedHeader
                subHeader
                subHeaderComponent={<SubHeaderComponent />}
                noDataComponent={
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {searchTerm ? 'No clients found' : 'No clients yet'}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      {searchTerm
                        ? 'Try adjusting your search criteria or clear filters'
                        : 'Get started by adding your first client to the system'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add Your First Client
                      </button>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        )}

        <Modal
          isOpen={showForm}
          onClose={handleClose}
          title={initialValues.id ? 'Edit Client' : 'Add New Client'}
        >
          <CustomerForm
            handleClose={handleClose}
            initialValues={initialValues}
          />
        </Modal>
      </div>
    </>
  );
};

export default Clients;