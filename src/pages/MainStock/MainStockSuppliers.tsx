import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Truck, Plus, Search, Mail, Phone } from 'lucide-react';
import { customStyles } from '../../utils/ui.helper.styles';
import { useSupplierStore } from '../../store/supplierStore';

const columns = [
  {
    name: 'Supplier Name',
    selector: (row: any) => row.name,
    sortable: true,
    grow: 1.5,
    cell: (row: any) => (
      <div className="flex items-center gap-3 py-2">
        <div className="w-9 h-9 rounded-xl bg-[#073c56]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[#073c56] font-bold text-sm">{row.name?.[0]}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{row.name}</p>
        </div>
      </div>
    ),
  },
  {
    name: 'Phone',
    selector: (row: any) => row.phone,
    cell: (row: any) =>
      row.phone ? (
        <a
          href={`tel:${row.phone}`}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#073c56] transition"
        >
          <Phone size={13} />
          {row.phone}
        </a>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    name: 'Email',
    selector: (row: any) => row.email,
    grow: 1.5,
    cell: (row: any) =>
      row.email ? (
        <a
          href={`mailto:${row.email}`}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#073c56] transition"
        >
          <Mail size={13} />
          {row.email}
        </a>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    name: 'Products',
    selector: (row: any) => row._count?.products ?? row.products?.length ?? 0,
    sortable: true,
    grow: 0.5,
    cell: (row: any) => (
      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
        {row._count?.products ?? row.products?.length ?? 0}
      </span>
    ),
  },
  {
    name: 'Added',
    selector: (row: any) => row.createdAt,
    sortable: true,
    cell: (row: any) =>
      row.createdAt
        ? new Date(row.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '—',
  },
];

export default function MainStockSuppliers() {
  const { suppliers, loading, fetchSuppliers } = useSupplierStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSuppliers(undefined, 1, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = (suppliers ?? []).filter(
    (s: any) =>
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">Suppliers</h2>
          <p className="py-2 text-gray-600">Manage your stock suppliers and contacts</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition">
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#073c56]"
            />
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
            <Truck size={16} />
            <span>{filtered.length} suppliers</span>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          highlightOnHover
          pointerOnHover
          customStyles={customStyles}
          progressPending={loading}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50]}
          responsive
          striped
          noDataComponent={
            <div className="py-16 text-center text-gray-400">
              <Truck size={40} className="mx-auto mb-3 opacity-30" />
              <p>No suppliers found</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
