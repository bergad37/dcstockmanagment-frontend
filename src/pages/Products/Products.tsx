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
import { useAuthStore } from '../../store/authStore';
const Products = () => {
  const { listProducts, products, deleteProduct, pagination } =
    useProductStore();
  const { fetchCategories, categories } = useCategoryStore();
  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] =
    useState<InitialValuesType>(productInitialValues);

  // products are loaded from the product store

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // pagination state (page is 1-based for backend)
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // initial load
    void listProducts({ page, limit: perPage });
    void fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const buildQueryParams = (override?: {
    page?: number;
    limit?: number;
  }): Record<string, any> => {
    const params: Record<string, any> = {};
    const effectivePage = override?.page ?? page;
    const effectiveLimit = override?.limit ?? perPage;

    params.page = effectivePage;
    params.limit = effectiveLimit;

    if (searchQuery) params.searchKey = searchQuery;
    if (selectedCategory?.value) params.categoryId = selectedCategory.value;

    return params;
  };

  const runSearch = (q: string) => {
    const trimmed = q.trim();
    setSearchQuery(trimmed);

    // debounce: wait 300ms after typing stops
    if (searchTimer) window.clearTimeout(searchTimer);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    searchTimer = window.setTimeout(async () => {
      // reset to first page when searching
      setPage(1);
      const params: Record<string, any> = {
        page: 1,
        limit: perPage
      };
      if (trimmed) params.searchKey = trimmed;
      if (selectedCategory?.value) params.categoryId = selectedCategory.value;
      await listProducts(params);
    }, 300);
  };

  const onCategoryChange = async (
    opt: { value: string; label: string } | null
  ) => {
    setSelectedCategory(opt);
    // reset to first page when filter changes
    setPage(1);
    const params: Record<string, any> = {
      page: 1,
      limit: perPage
    };
    if (searchQuery) params.searchKey = searchQuery;
    if (opt?.value) params.categoryId = opt.value;
    await listProducts(params);
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
      quantity: data.stock.quantity ?? null,
      serialNumber: data.serialNumber || '',
      costPrice: data.costPrice || null,
      entryDate: data.entryDate
        ? new Date(data?.entryDate).toISOString().split('T')[0]
        : '',
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

  const handleChangePage = async (newPage: number) => {
    setPage(newPage);
    const params = buildQueryParams({ page: newPage });
    await listProducts(params);
  };

  const handleChangeRowsPerPage = async (
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
    const params = buildQueryParams({ page: newPage, limit: newPerPage });
    await listProducts(params);
  };

  return (
    <div>
      <DeleteModal
        isOpen={showDeleteModal}
        description="Are you sure you want to delete this product?"
        requireComment={true} // 👈 enforce here
        commentLabel="Why are you deleting this product?"
        onConfirm={async (comment) => {
          if (deleteItem) {
            await deleteProduct(deleteItem, comment); // 👈 send comment
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

              {user?.role === 'ADMIN' && (
                <Button
                  label="Add New product"
                  onClick={() => setShowForm(true)}
                  className="self-start sm:self-auto"
                />
              )}
            </div>
          </div>

          {/* Table wrapper for horizontal scrolling on mobile */}
          <div className="overflow-x-auto my-12">
            <DataTable
              columns={productColumns(actions, user)}
              data={Array.isArray(products) ? products : []}
              customStyles={customStyles}
              pagination
              paginationServer
              paginationPerPage={perPage}
              paginationTotalRows={
                pagination?.total ??
                (Array.isArray(products) ? products.length : 0)
              }
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
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
