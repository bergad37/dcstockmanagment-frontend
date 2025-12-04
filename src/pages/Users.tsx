import DataTable from 'react-data-table-component';
import { userColumns } from '../utils/columns/user.column';
import Button from '../components/ui/Button';

const Users = () => {
  const userList = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'manager'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      role: 'staff'
    },
    {
      id: '4',

      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      role: 'supervisor'
    },
    {
      id: '5',
      name: 'David Lee',
      email: 'david.lee@example.com',
      role: 'staff'
    },
    {
      id: '6',
      name: 'Olivia Martinez',
      email: 'olivia.martinez@example.com',
      role: 'admin'
    },
    {
      id: '7',
      name: 'James Anderson',
      email: 'james.anderson@example.com',
      role: 'staff'
    },
    {
      id: '8',
      name: 'Sophia Clark',
      email: 'sophia.clark@example.com',
      role: 'manager'
    },
    {
      id: '9',
      name: 'William Turner',
      email: 'william.turner@example.com',
      role: 'staff'
    },
    {
      id: '10',
      name: 'Ava Thompson',
      email: 'ava.thompson@example.com',
      role: 'admin'
    }
  ];

  return (
    <div>
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

        {/* Right side: Button */}
        <Button label="Add New User" onClick={() => console.log('clicked')} />
      </div>

      <div className="m-2 rounded-[10px] border border-[#EAECF0]">
        <DataTable
          columns={userColumns()}
          data={userList}
          pagination
          paginationPerPage={5}
          fixedHeader
        />
      </div>
    </div>
  );
};

export default Users;
