import DataTable from 'react-data-table-component';
import { productCategoriesColumns } from '../../utils/columns/category.column';
import Button from '../../components/ui/Button';
import { useEffect, useState } from 'react';
import CategoryForm, { type InitialValuesType } from './categories.form';
import { useCategoryStore } from '../../store/categoriesStore';
import { Edit2, TrashIcon } from 'lucide-react';
import DeleteModal from '../../components/ui/ConfirmModal';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';

const Settings = () => {
  const { categories, fetchCategories, deleteCategory } = useCategoryStore();
  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialValuesType>({
    id: null,
    name: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const deleteAction = (data: any) => {
    setDeleteItem(data.id);
    setShowDeleteModal(true);
  };

  const editAction = (data: any) => {
    setShowForm(true);
    setInitialValues({ id: data.id, name: data.name });
  };

  const handleDelete = () => {
    if (deleteItem) {
      deleteCategory(deleteItem);
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
    setInitialValues({ id: null, name: '' });
  };

  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this department?"
        onConfirm={() => handleDelete()}
        onCancel={handleClose}
        loading={false}
      />

      <div className="w-full sm:p-6">
        {/* Top header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="px-4 py-1 text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
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
              {(categories ?? []).length > 0 && (
                <SearchBar
                  onSubmit={() => console.log('search items needed')}
                />
              )}
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

        <Modal
          isOpen={showForm}
          onClose={handleClose}
          title={'Add New Category'}
        >
          {' '}
          <CategoryForm
            handleClose={handleClose}
            initialValues={initialValues}
          />
        </Modal>
      </div>
    </>
  );
};

export default Settings;
