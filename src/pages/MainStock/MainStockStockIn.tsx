import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ArrowDownToLine, Plus } from "lucide-react";
import { customStyles } from "../../utils/ui.helper.styles";
import { useStockInStore } from "../../store/stockInStore";
import Modal from "../../components/ui/Modal";
import StockInForm from "./StockInForm";

const columns = [
  {
    name: "Date",
    selector: (row: any) => row.receivedAt,
    sortable: true,
    cell: (row: any) =>
      row.receivedAt
        ? new Date(row.receivedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
  },
  {
    name: "Product",
    selector: (row: any) => row.product?.name,
    sortable: true,
    grow: 2,
    cell: (row: any) => (
      <div className="py-1">
        <p className="font-medium text-gray-800">{row.product?.name ?? "—"}</p>
        {row.product?.serialNumber && (
          <p className="text-xs text-gray-400 font-mono">
            SN: {row.product.serialNumber}
          </p>
        )}
      </div>
    ),
  },
  {
    name: "Supplier",
    selector: (row: any) => row.supplier?.name,
    sortable: true,
    cell: (row: any) =>
      row.supplier?.name ?? <span className="text-gray-300">—</span>,
  },
  {
    name: "Qty Received",
    selector: (row: any) => row.quantity,
    sortable: true,
    grow: 0.6,
    cell: (row: any) => (
      <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
        +{row.quantity}
      </span>
    ),
  },
  {
    name: "Unit Cost",
    selector: (row: any) => row.unitCost,
    sortable: true,
    cell: (row: any) =>
      row.unitCost != null ? (
        <span className="text-sm font-medium text-gray-700">
          {Number(row.unitCost).toLocaleString()}
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    name: "Total Value",
    selector: (row: any) => (row.unitCost ?? 0) * row.quantity,
    sortable: true,
    cell: (row: any) =>
      row.unitCost != null ? (
        <span className="text-sm font-semibold text-[#073c56]">
          {(Number(row.unitCost) * row.quantity).toLocaleString()}
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    name: "Invoice #",
    selector: (row: any) => row.invoiceNo,
    cell: (row: any) =>
      row.invoiceNo ? (
        <span className="text-xs font-mono text-gray-500">{row.invoiceNo}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    name: "Received By",
    selector: (row: any) => row.receivedBy,
    cell: (row: any) =>
      row.receivedBy ?? <span className="text-gray-300">—</span>,
  },
  {
    name: "Notes",
    selector: (row: any) => row.notes,
    grow: 1.5,
    cell: (row: any) =>
      row.notes ? (
        <span className="text-xs text-gray-500 italic">{row.notes}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
];

export default function MainStockStockIn() {
  const { stockIns, loading, pagination, fetchStockIns } = useStockInStore();
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);

  const load = (
    p = page,
    pp = perPage,
    s = search,
    from = dateFrom,
    to = dateTo,
  ) => {
    const params: Record<string, any> = { page: p, limit: pp };
    if (s) params.searchKey = s;
    if (from) params.startDate = from;
    if (to) params.endDate = to;
    fetchStockIns(params);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const totalValue = stockIns.reduce(
  //   (sum, r) => sum + Number(r.unitCost ?? 0) * r.quantity,
  //   0,
  // );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">
            Stock In
          </h2>
          <p className="py-2 text-gray-600">
            Record of all incoming stock from suppliers
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition"
        >
          <Plus size={16} />
          Record Stock In
        </button>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
          <ArrowDownToLine size={18} className="text-[#073c56]" />
          <div>
            <p className="text-xs text-gray-400">Records</p>
            <p className="text-lg font-bold text-[#073c56]">
              {pagination?.total ?? stockIns.length}
            </p>
          </div>
        </div>
        {/* <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm"></span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Value (page)</p>
            <p className="text-lg font-bold text-[#073c56]">{totalValue.toLocaleString()}</p>
          </div>
        </div> */}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search product, supplier, invoice..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              load(1, perPage, e.target.value, dateFrom, dateTo);
            }}
            className="flex-1 min-w-[200px] max-w-xs border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#073c56]"
          />

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 whitespace-nowrap">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
                load(1, perPage, search, e.target.value, dateTo);
              }}
              className="border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:border-[#073c56] text-gray-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 whitespace-nowrap">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
                load(1, perPage, search, dateFrom, e.target.value);
              }}
              className="border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:border-[#073c56] text-gray-600"
            />
          </div>

          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setPage(1);
                load(1, perPage, search, "", "");
              }}
              className="px-3 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </div>

        <DataTable
          columns={columns}
          data={stockIns}
          highlightOnHover
          pointerOnHover
          customStyles={customStyles}
          progressPending={loading}
          progressComponent={
            <div className="py-16 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#073c56] mb-3" />
              <p>Loading records...</p>
            </div>
          }
          pagination
          paginationServer
          paginationPerPage={perPage}
          paginationTotalRows={pagination?.total ?? 0}
          onChangePage={(p) => {
            setPage(p);
            load(p, perPage, search, dateFrom, dateTo);
          }}
          onChangeRowsPerPage={(pp, p) => {
            setPerPage(pp);
            setPage(p);
            load(p, pp, search, dateFrom, dateTo);
          }}
          paginationRowsPerPageOptions={[10, 20, 50]}
          responsive
          striped
          noDataComponent={
            <div className="py-16 text-center text-gray-400">
              <ArrowDownToLine size={40} className="mx-auto mb-3 opacity-30" />
              <p>No stock-in records found</p>
            </div>
          }
        />
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Record Stock In"
        maxHeight={600}
      >
        <StockInForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            load(1, perPage);
            setPage(1);
          }}
        />
      </Modal>
    </div>
  );
}
