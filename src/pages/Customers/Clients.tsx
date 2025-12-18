import DataTable from 'react-data-table-component';
import Button from '../../components/ui/Button';
import { customerColumns } from '../../utils/columns/customer.column';
import { useEffect, useState } from 'react';
import type { CustomerInitialValues } from './clients.form';
import { Edit2, TrashIcon } from 'lucide-react';
import CustomerForm from './clients.form';
import { useCustomerStore } from '../../store/CustomerStore';
import DeleteModal from '../../components/ui/ConfirmModal';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import { customStyles } from '../../utils/ui.helper.styles';

const Clients = () => {
  const { fetchCustomer, deleteCustomer, customers, loading, pagination } = useCustomerStore();
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
    fetchCustomer(pagination.page, pagination.limit);
  }, [fetchCustomer]);



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
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

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
    setInitialValues(initialValues);
  };

  // customers are loaded from the store (server-side)

  console.log('###########', deleteItem);
  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this department?"
        onConfirm={() => handleDelete()}
        onCancel={handleClose}
        loading={false}
      />

      <div>
        {!showForm && (
          <div>
            <div className="flex items-center justify-between py-6">
              {/* Left side: Title + Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
                  Clients Directory
                </h2>
                <p className="py-2 text-sm text-gray-600">
                  Manage and view all the clients in the system.
                </p>
              </div>
              <Button
                label="Register a client"
                onClick={() => setShowForm(true)}
              />
            </div>

            <div className="flex justify-between">
              <SearchBar onSubmit={() => console.log('search items needed')} />
            </div>

            <div className="m-2 py-4 rounded-[10px] border border-[#EAECF0]">
              <DataTable
                columns={customerColumns(actions)}
                data={customers}
                pagination
                customStyles={customStyles}
                paginationServer
                paginationPerPage={pagination.limit}
                paginationTotalRows={pagination.total}
                onChangePage={(page) => fetchCustomer(page, pagination.limit)}
                onChangeRowsPerPage={(newPerPage, page) =>
                  fetchCustomer(page, newPerPage)
                }
                progressPending={loading}
                fixedHeader
              />
            </div>
          </div>
        )}
        <Modal
          isOpen={showForm}
          onClose={handleClose}
          title={'Add New Customer'}
        >
          {' '}
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
