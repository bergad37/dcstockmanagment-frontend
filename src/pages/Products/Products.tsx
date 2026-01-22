import { useEffect, useState } from 'react';
import { useProductStore } from '../../store/productStore';
import ProductForm from './product.form';
import type { ProductFormValues as InitialValuesType } from '../../types/product';
import { productInitialValues } from '../../schemas/productSchema';
import DataTable from 'react-data-table-component';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import CustomSelect from '../../components/ui/SelectField';
import { Edit2, TrashIcon } from 'lucide-react';
import DeleteModal from '../../components/ui/ConfirmModal';
import { productColumns } from '../../utils/columns/products.column';
import Modal from '../../components/ui/Modal';
import { useCategoryStore } from '../../store/categoriesStore';
import { customStyles } from '../../utils/ui.helper.styles';
const Products = () => {
  const { listProducts, products, deleteProduct } = useProductStore();
  const { fetchCategories, categories } = useCategoryStore();
  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] =
    useState<InitialValuesType>(productInitialValues);

  // products are loaded from the product store

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    listProducts();
    fetchCategories();
  }, [listProducts, fetchCategories]);

  // filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const categoryOptions =
    categories?.map((c: any) => ({ value: c.id, label: c.name })) ?? [];

  // debounce timer
  let searchTimer: number | undefined;

  const runSearch = (q: string) => {
    const trimmed = q.trim();
    setSearchQuery(trimmed);

    // debounce: wait 300ms after typing stops
    if (searchTimer) window.clearTimeout(searchTimer);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    searchTimer = window.setTimeout(async () => {
      const params: Record<string, any> = {};
      if (trimmed) params.searchKey = trimmed;
      if (selectedCategory?.value) params.categoryId = selectedCategory.value;
      await listProducts(Object.keys(params).length ? params : undefined);
    }, 300);
  };

  const onCategoryChange = async (
    opt: { value: string; label: string } | null
  ) => {
    setSelectedCategory(opt);
    const params: Record<string, any> = {};
    if (searchQuery) params.searchKey = searchQuery;
    if (opt?.value) params.categoryId = opt.value;
    await listProducts(Object.keys(params).length ? params : undefined);
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
      description: data.description || '',
      warranty: data.warranty,
      categoryId: data.categoryId ?? data.category?.id ?? data.category ?? '',
      supplierId: data.supplierId ?? data.supplier?.id ?? '',
      quantity: data.quantity ?? null,
      serialNumber: data.serialNumber || '',
      costPrice: data.costPrice || null,
      entryDate: data.entryDate || '',
      type: data.type ? data.type.toLowerCase() : 'item'
    });
  };

  //   const handleDelete = () => {
  //     if (deleteItem) {
  //       deleteCategory(deleteItem);
  //     }
  //   };
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
  };

  return (
    <div>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this product?"
        onConfirm={async () => {
          if (deleteItem) {
            await deleteProduct(deleteItem);
            await listProducts();
          }
          handleClose();
        }}
        onCancel={handleClose}
        loading={false}
      />
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
          Products
        </h2>
        <p className="py-2 text-sm text-gray-600">
          Manage and view all products in the stock.
        </p>
      </div>

      {!showForm && (
        <div className="w-full  m-2 rounded-xl border border-[#EAECF0] bg-white">
          {/* Header row (Responsive) */}
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-2 px-4 py-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#073c56]">
              Registered products
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
              <div className="mr-2 w-full sm:w-72">
                <SearchBar
                  onSubmit={runSearch}
                  placeholder="Search products..."
                />
              </div>

              <div className="mr-2 w-full sm:w-56">
                <CustomSelect
                  id="filter-category"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={onCategoryChange}
                  placeholder="Filter by category"
                  isClearable
                />
              </div>

              <Button
                label="Add New product"
                onClick={() => setShowForm(true)}
                className="self-start sm:self-auto"
              />
            </div>
          </div>

          {/* Table wrapper for horizontal scrolling on mobile */}
          <div className="overflow-x-auto my-12">
            <DataTable
              columns={productColumns(actions)}
              data={Array.isArray(products) ? products : []}
              customStyles={customStyles}
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
        title={initialValues.id ? 'Edit Product' : 'Add new product in stock'}
        maxHeight={600}
      >
        <ProductForm
          handleClose={handleClose}
          initialValues={initialValues}
          isEditClicked={initialValues.id !== null}
        />
      </Modal>
    </div>
  );
};

export default Products;
