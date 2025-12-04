import DataTable from 'react-data-table-component';
import Button from '../components/ui/Button';
import { customerColumns } from '../utils/columns/customer.column';

const Clients = () => {
  const clientsList = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 202 555 0147',
      address: '123 Maple Street, Boston, MA',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '+1 202 555 0173',
      address: '45 Sunset Blvd, Los Angeles, CA',
      role: 'manager'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1 202 555 0134',
      address: '89 Eastwood Road, Chicago, IL',
      role: 'staff'
    },
    {
      id: '4',
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      phone: '+1 202 555 0198',
      address: '17 Pine Avenue, Seattle, WA',
      role: 'supervisor'
    },
    {
      id: '5',
      name: 'David Lee',
      email: 'david.lee@example.com',
      phone: '+1 202 555 0187',
      address: '64 King Street, Houston, TX',
      role: 'staff'
    },
    {
      id: '6',
      name: 'Olivia Martinez',
      email: 'olivia.martinez@example.com',
      phone: '+1 202 555 0159',
      address: '201 Riverside Lane, Miami, FL',
      role: 'admin'
    },
    {
      id: '7',
      name: 'James Anderson',
      email: 'james.anderson@example.com',
      phone: '+1 202 555 0126',
      address: '3201 Oak Street, Denver, CO',
      role: 'staff'
    },
    {
      id: '8',
      name: 'Sophia Clark',
      email: 'sophia.clark@example.com',
      phone: '+1 202 555 0112',
      address: '77 Parkway Drive, Atlanta, GA',
      role: 'manager'
    },
    {
      id: '9',
      name: 'William Turner',
      email: 'william.turner@example.com',
      phone: '+1 202 555 0144',
      address: '55 Belmont Road, Phoenix, AZ',
      role: 'staff'
    },
    {
      id: '10',
      name: 'Ava Thompson',
      email: 'ava.thompson@example.com',
      phone: '+1 202 555 0192',
      address: '400 Spring Street, New York, NY',
      role: 'admin'
    }
  ];

  return (
    <div>
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

          {/* Right side: Button */}
          <Button
            label="Register a client"
            onClick={() => console.log('clicked')}
          />
        </div>

        <div className="m-2 rounded-[10px] border border-[#EAECF0]">
          <DataTable
            columns={customerColumns()}
            data={clientsList}
            pagination
            paginationPerPage={5}
            fixedHeader
          />
        </div>
      </div>
    </div>
  );
};

export default Clients;
