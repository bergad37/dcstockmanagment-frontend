import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Search, Shield } from 'lucide-react';
import { useAuditStore, type AuditLog } from '../../store/auditStore';
import { customStyles } from '../../utils/ui.helper.styles';

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  LOGIN: 'bg-purple-100 text-purple-700',
  LOGOUT: 'bg-gray-100 text-gray-600',
  PASSWORD_RESET: 'bg-orange-100 text-orange-700',
  PASSWORD_CHANGE: 'bg-yellow-100 text-yellow-700',
};

const actionBadge = (action: string) => {
  const color = ACTION_COLORS[action] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {action}
    </span>
  );
};

const columns = [
  {
    name: 'Date & Time',
    selector: (row: AuditLog) => row.createdAt,
    cell: (row: AuditLog) => (
      <span className="text-xs text-gray-600 whitespace-nowrap">
        {new Date(row.createdAt).toLocaleString()}
      </span>
    ),
    sortable: true,
    width: '160px',
  },
  {
    name: 'User',
    cell: (row: AuditLog) => (
      <div className="py-1">
        <div className="text-sm font-medium text-gray-900">{row.userName}</div>
        <div className="text-xs text-gray-400">{row.userEmail}</div>
      </div>
    ),
    sortable: false,
    minWidth: '160px',
  },
  {
    name: 'Action',
    cell: (row: AuditLog) => actionBadge(row.action),
    sortable: false,
    width: '140px',
  },
  {
    name: 'Entity',
    selector: (row: AuditLog) => row.entity,
    cell: (row: AuditLog) => (
      <span className="text-sm text-gray-700">{row.entity}</span>
    ),
    sortable: false,
    width: '120px',
  },
  {
    name: 'Description',
    selector: (row: AuditLog) => row.description,
    cell: (row: AuditLog) => (
      <span className="text-sm text-gray-600 line-clamp-2">{row.description}</span>
    ),
    sortable: false,
    grow: 2,
  },
  {
    name: 'IP Address',
    selector: (row: AuditLog) => row.ipAddress ?? '—',
    cell: (row: AuditLog) => (
      <span className="text-xs text-gray-400 font-mono">{row.ipAddress ?? '—'}</span>
    ),
    sortable: false,
    width: '130px',
  },
];

const AuditTrail = () => {
  const { logs, loading, pagination, listAuditLogs } = useAuditStore();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    listAuditLogs({ page: 1, limit: pagination.limit });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    listAuditLogs({ page: 1, limit: pagination.limit, search, action: actionFilter || undefined });
  };

  const handlePageChange = (page: number) => {
    listAuditLogs({ page, limit: pagination.limit, search, action: actionFilter || undefined });
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    listAuditLogs({ page, limit: newPerPage, search, action: actionFilter || undefined });
  };

  return (
    <div>
      <div className="flex items-center justify-between py-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
            Audit Trail
          </h2>
          <p className="py-2 text-sm text-gray-600">
            Track all actions performed by users in the system.
          </p>
        </div>
        <Shield className="text-[#073c56] opacity-20" size={48} />
      </div>

      <div className="w-full rounded-xl border border-[#EAECF0] bg-white">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3 px-4 py-4">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#073c56]">
            Activity Log
          </h2>

          <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none text-gray-700"
            >
              <option value="">All actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="PASSWORD_RESET">Password Reset</option>
              <option value="PASSWORD_CHANGE">Password Change</option>
            </select>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search user or action…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#073c56]/40 focus:border-[#073c56] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-[#073c56] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#062e42]"
            >
              Filter
            </button>
          </form>
        </div>

        <div className="m-2 rounded-[10px] border border-[#EAECF0]">
          <DataTable
            columns={columns}
            data={logs}
            customStyles={customStyles}
            pagination
            paginationServer
            paginationPerPage={pagination.limit}
            paginationTotalRows={pagination.total}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            progressPending={loading}
            fixedHeader
            noDataComponent={
              <div className="py-12 text-center text-gray-400 text-sm">
                No audit logs found.
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
