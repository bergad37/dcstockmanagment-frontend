import DataTable from 'react-data-table-component';
import Button from '../../components/ui/Button';
import { customerColumns } from '../../utils/columns/customer.column';
import { useEffect, useState } from 'react';
import type { CustomerInitialValues } from './clients.form';
import { Edit2, TrashIcon } from 'lucide-react';
import CustomerForm from './clients.form';
import { useCustomerStore } from '../../store/CustomerStore';
import DeleteModal from '../../components/ui/ConfirmModal';

const Clients = () => {
  const { fetchCustomer } = useCustomerStore();
  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] = useState<CustomerInitialValues>({
    id: null,
    names: '',
    email: '',
    address: '',
    phoneNumber: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const deleteAction = (data: any) => {
    setDeleteItem(data.id);
    setShowDeleteModal(true);
  };

  const editAction = (data: CustomerInitialValues) => {
    setShowForm(true);
    setInitialValues({
      id: data.id,
      names: data.names,
      email: data.email,
      address: data.address,
      phoneNumber: data.phoneNumber
    });
  };

  const handleDelete = () => {
    console.log('Client deleted sucessfully');
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

  const clientsList = [
    {
      id: '1',
      names: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1 202 555 0147',
      address: '123 Maple Street, Boston, MA',
      role: 'admin'
    },
    {
      id: '2',
      names: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phoneNumber: '+1 202 555 0173',
      address: '45 Sunset Blvd, Los Angeles, CA',
      role: 'manager'
    },
    {
      id: '3',
      names: 'Michael Brown',
      email: 'michael.brown@example.com',
      phoneNumber: '+1 202 555 0134',
      address: '89 Eastwood Road, Chicago, IL',
      role: 'staff'
    },
    {
      id: '4',
      names: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      phoneNumber: '+1 202 555 0198',
      address: '17 Pine Avenue, Seattle, WA',
      role: 'supervisor'
    },
    {
      id: '5',
      names: 'David Lee',
      email: 'david.lee@example.com',
      phoneNumber: '+1 202 555 0187',
      address: '64 King Street, Houston, TX',
      role: 'staff'
    },
    {
      id: '6',
      names: 'Olivia Martinez',
      email: 'olivia.martinez@example.com',
      phoneNumber: '+1 202 555 0159',
      address: '201 Riverside Lane, Miami, FL',
      role: 'admin'
    },
    {
      id: '7',
      names: 'James Anderson',
      email: 'james.anderson@example.com',
      phoneNumber: '+1 202 555 0126',
      address: '3201 Oak Street, Denver, CO',
      role: 'staff'
    },
    {
      id: '8',
      names: 'Sophia Clark',
      email: 'sophia.clark@example.com',
      phoneNumber: '+1 202 555 0112',
      address: '77 Parkway Drive, Atlanta, GA',
      role: 'manager'
    },
    {
      id: '9',
      names: 'William Turner',
      email: 'william.turner@example.com',
      phoneNumber: '+1 202 555 0144',
      address: '55 Belmont Road, Phoenix, AZ',
      role: 'staff'
    },
    {
      id: '10',
      names: 'Ava Thompson',
      email: 'ava.thompson@example.com',
      phoneNumber: '+1 202 555 0192',
      address: '400 Spring Street, New York, NY',
      role: 'admin'
    }
  ];

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

            <div className="m-2 rounded-[10px] border border-[#EAECF0]">
              <DataTable
                columns={customerColumns(actions)}
                data={clientsList}
                pagination
                paginationPerPage={5}
                fixedHeader
              />
            </div>
          </div>
        )}
        {showForm && (
          <CustomerForm
            handleClose={handleClose}
            initialValues={initialValues}
            listCustomers={fetchCustomer}
          />
        )}
      </div>
    </>
  );
};

export default Clients;
