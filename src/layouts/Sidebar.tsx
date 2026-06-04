import { useState } from 'react';
import {
  Menu,
  LayoutDashboard,
  Users,
  Briefcase,
  ArrowDownUp,
  Settings,
  Warehouse,
  Package,
  Truck,
  ArrowDownToLine,
  ArrowRightLeft,
  RefreshCw,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePortalStore } from '../store/portalStore';

const miniStockItems = [
  { title: 'Analytics', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'Users', icon: Users, path: '/users' },
  { title: 'Clients', icon: Briefcase, path: '/clients' },
  { title: 'Products/Equipments', icon: Briefcase, path: '/products' },
  { title: 'Stock', icon: ArrowDownUp, path: '/stock' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

const mainStockItems = [
  { title: 'Overview', icon: LayoutDashboard, path: '/main-stock/overview' },
  { title: 'Products', icon: Package, path: '/main-stock/products' },
  { title: 'Suppliers', icon: Truck, path: '/main-stock/suppliers' },
  { title: 'Stock In', icon: ArrowDownToLine, path: '/main-stock/stock-in' },
  { title: 'Transfers', icon: ArrowRightLeft, path: '/main-stock/transfers' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { activePortal, clearPortal } = usePortalStore();

  const menuItems = activePortal === 'main' ? mainStockItems : miniStockItems;

  const handleSwitchPortal = () => {
    clearPortal();
    navigate('/portal-select');
  };

  return (
    <div
      className={`
        bg-primary text-white h-screen transition-all shadow-lg duration-300 flex flex-col ${
          open ? 'w-64' : 'w-20'
        }`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4">
        <h1
          className={`font-bold text-xl transition-all ${
            open ? 'block' : 'hidden'
          }`}
        >
          <img
            alt="dc survey ltd logo Company Logo"
            src="/logo.png"
            className="mx-auto h-40 w-40 sm:h-20 sm:w-40 object-cover"
          />
        </h1>
        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>

      {/* Portal badge */}
      {open && (
        <div className="mb-2 px-3 py-4 rounded-lg bg-white/10 text-xs font-semibold flex items-center gap-2">
          {activePortal === 'main' ? (
            <>
              <Warehouse size={13} />
              Main Stock
            </>
          ) : (
            <>
              <Briefcase size={13} />
              Mini Stock
            </>
          )}
        </div>
      )}

      {/* Menu */}
      <nav className="mt-2 flex flex-col gap-1 flex-1">
        {menuItems.map(({ title, icon: Icon, path }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={title}
              to={path}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-lg transition
                hover:bg-white/10
                ${isActive ? 'bg-white/10' : ''}
              `}
            >
              <Icon size={22} />
              <span className={`${open ? 'block' : 'hidden'} text-sm`}>
                {title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Switch portal */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSwitchPortal}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
        >
          <RefreshCw size={18} />
          <span className={`${open ? 'block' : 'hidden'} text-sm`}>
            Switch Portal
          </span>
        </button>
      </div>
    </div>
  );
}
