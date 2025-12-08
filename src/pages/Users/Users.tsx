import DataTable from 'react-data-table-component';
import Button from '../../components/ui/Button';
import { useEffect, useState } from 'react';
import UserForm, { type UserInitialValues } from './user.form';
import { Edit2, TrashIcon } from 'lucide-react';
import DeleteModal from '../../components/ui/ConfirmModal';
import { userColumns } from '../../utils/columns/user.column';
import { useUserStore } from '../../store/userStore';

const Users = () => {
  const { listUsers, users } = useUserStore();
  const [initialValues, setInitialValues] = useState<UserInitialValues>({
    id: null,
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    listUsers();
  }, [listUsers]);

  const [showForm, setShowForm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  //   const userList = [
  //     {
  //       id: '1',
  //       name: 'John Doe',
  //       email: 'john.doe@example.com',
  //       role: 'admin'
  //     },
  //     {
  //       id: '2',
  //       name: 'Sarah Williams',
  //       email: 'sarah.williams@example.com',
  //       role: 'manager'
  //     },
  //     {
  //       id: '3',
  //       name: 'Michael Brown',
  //       email: 'michael.brown@example.com',
  //       role: 'staff'
  //     },
  //     {
  //       id: '4',

  //       name: 'Emma Johnson',
  //       email: 'emma.johnson@example.com',
  //       role: 'supervisor'
  //     },
  //     {
  //       id: '5',
  //       name: 'David Lee',
  //       email: 'david.lee@example.com',
  //       role: 'staff'
  //     },
  //     {
  //       id: '6',
  //       name: 'Olivia Martinez',
  //       email: 'olivia.martinez@example.com',
  //       role: 'admin'
  //     },
  //     {
  //       id: '7',
  //       name: 'James Anderson',
  //       email: 'james.anderson@example.com',
  //       role: 'staff'
  //     },
  //     {
  //       id: '8',
  //       name: 'Sophia Clark',
  //       email: 'sophia.clark@example.com',
  //       role: 'manager'
  //     },
  //     {
  //       id: '9',
  //       name: 'William Turner',
  //       email: 'william.turner@example.com',
  //       role: 'staff'
  //     },
  //     {
  //       id: '10',
  //       name: 'Ava Thompson',
  //       email: 'ava.thompson@example.com',
  //       role: 'admin'
  //     }
  //   ];

  const handleClose = () => {
    setShowForm(false);
    setShowDeleteModal(false);
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
        description="Are you sure you want to delete this department?"
        onConfirm={() => console.log('Delete item')}
        onCancel={handleClose}
        loading={false}
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
              pagination
              paginationPerPage={5}
              fixedHeader
            />
          </div>
        </div>
      )}
      {showForm && (
        <UserForm handleClose={handleClose} initialValues={initialValues} />
      )}
    </div>
  );
};

export default Users;
