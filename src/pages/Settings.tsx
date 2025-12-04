import DataTable from 'react-data-table-component';
import { productCategoriesColumns } from '../utils/columns/category.column';
import Button from '../components/ui/Button';
import { useState } from 'react';
import CategoryForm from './Categories/categories.form';

const Settings = () => {


  const [showForm, setShowForm] = useState(false);
  const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Furniture' },
    { id: '3', name: 'Office Supplies' },
    { id: '4', name: 'Groceries' },
    { id: '5', name: 'Clothing' },
    { id: '6', name: 'Accessories' },
    { id: '7', name: 'Home Appliances' },
    { id: '8', name: 'Sports Equipment' },
    { id: '9', name: 'Automotive' },
    { id: '10', name: 'Books & Stationery' }
  ];

  const handleClose = () => {
    setShowForm(false);
  };
  return (
    <div className="w-full sm:p-6">
      {/* Top header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="py-1 text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
            Settings
          </h2>
        </div>
      </div>

      {/* Table section */}
      {!showForm && (
        <div className="w-full  m-2 rounded-xl border border-[#EAECF0] bg-white">
          {/* Header row (Responsive) */}
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-2 px-4 py-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#073c56]">
              Configured Categories
            </h2>

            <Button
              label="Add category"
              onClick={() => setShowForm(true)}
              className="self-start sm:self-auto"
            />
          </div>

          {/* Table wrapper for horizontal scrolling on mobile */}
          <div className="overflow-x-auto">
            <DataTable
              columns={productCategoriesColumns()}
              data={categories}
              pagination
              paginationPerPage={5}
              fixedHeader
              responsive
            />
          </div>
        </div>
      )}

      {showForm && <CategoryForm handleClose={handleClose} />}
    </div>
  );
};

export default Settings;
