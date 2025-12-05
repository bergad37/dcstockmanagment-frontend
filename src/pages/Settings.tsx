import DataTable from 'react-data-table-component';
import { productCategoriesColumns } from '../utils/columns/category.column';
import Button from '../components/ui/Button';
import { useEffect, useState } from 'react';
import CategoryForm from './Categories/categories.form';
import { useCategoryStore } from '../store/categoriesStore';
import { Edit2, TrashIcon } from 'lucide-react';

const Settings = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);



const deleteAction=()=>{};

const editAction=()=>{};


 const actions = [
    {
      icon: <Edit2 className='h-[20px] w-[20px] text-[#475467]' />,
      handler: editAction,
      label: 'Edit'
    },
    {
      icon: <TrashIcon className='h-[20px] w-[20px] text-[#475467]' />,
      handler: deleteAction,
      label: 'Delete'
    }
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
              columns={productCategoriesColumns(actions)}
              data={categories ?? []}
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
