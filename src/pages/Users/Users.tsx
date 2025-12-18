import DataTable from 'react-data-table-component';
import Button from '../../components/ui/Button';
import { useEffect, useState } from 'react';
import UserForm, { type UserInitialValues } from './user.form';
import { Edit2, TrashIcon } from 'lucide-react';
import DeleteModal from '../../components/ui/ConfirmModal';
import { userColumns } from '../../utils/columns/user.column';
import { useUserStore } from '../../store/userStore';
import Modal from '../../components/ui/Modal';
import { customStyles } from '../../utils/ui.helper.styles';

const Users = () => {

  const { listUsers, users, deleteUser, loading, pagination } = useUserStore();
  const [initialValues, setInitialValues] = useState<UserInitialValues>({
    id: null,
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    // load first page with store defaults
    listUsers(pagination.page, pagination.limit);
  }, [listUsers]);

  const [showForm, setShowForm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setShowDeleteModal(false);
    setInitialValues({
      id: null,
      name: '',
      email: '',
      role: ''
    });
  };

  const deleteAction = (data: any) => {
    setDeleteItem(data.id);
    setShowDeleteModal(true);
  };

  const editAction = (data: any) => {
    setShowForm(true);
    setInitialValues({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    });
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

  console.log('delete item', deleteItem);
  return (
    <div>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this user?"
        onConfirm={async () => {
          if (!deleteItem) return;
          await deleteUser(deleteItem);
          handleClose();
        }}
        onCancel={handleClose}
        loading={loading}
      />

      <div className="flex items-center justify-between py-6">
        {/* Left side: Title + Subtitle */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
            Users Directory
          </h2>
          <p className="py-2 text-sm text-gray-600">
            Manage and view all registered users in the system.
          </p>
        </div>
      </div>

      {!showForm && (
        <div className="w-full  m-2 rounded-xl border border-[#EAECF0] bg-white">
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-2 px-4 py-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#073c56]">
              Registered users
            </h2>

            <Button
              label="Add New User"
              onClick={() => setShowForm(true)}
              className="self-start sm:self-auto"
            />
          </div>

          <div className="m-2 rounded-[10px] border border-[#EAECF0]">
            <DataTable
              columns={userColumns(actions)}
              data={users || []}
              customStyles={customStyles}
              pagination
              paginationServer
              paginationPerPage={pagination.limit}
              paginationTotalRows={pagination.total}
              onChangePage={(page) => listUsers(page, pagination.limit)}
              onChangeRowsPerPage={(newPerPage, page) =>
                listUsers(page, newPerPage)
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
        title={'Register a New User'}
      >
        {' '}
        <UserForm handleClose={handleClose} initialValues={initialValues} />
      </Modal>
    </div>
  );
};

export default Users;
