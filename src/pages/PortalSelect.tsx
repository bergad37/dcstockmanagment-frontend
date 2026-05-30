import { useNavigate } from 'react-router-dom';
import { Warehouse, Briefcase, ArrowRight } from 'lucide-react';
import { usePortalStore } from '../store/portalStore';
import { useAuthStore } from '../store/authStore';

export default function PortalSelect() {
  const navigate = useNavigate();
  const { setPortal } = usePortalStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Derive which portals this user can access
  const canMini =
    !user?.portalAccess ||
    user.portalAccess === 'MINI_STOCK' ||
    user.portalAccess === 'BOTH';
  const canMain =
    user?.portalAccess === 'MAIN_STOCK' || user?.portalAccess === 'BOTH';

  const handleSelect = (portal: 'main' | 'mini') => {
    setPortal(portal);
    if (portal === 'main') {
      navigate('/main-stock/overview');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <img
          alt="DC Survey Ltd logo"
          src="/logo.png"
          className="h-12 w-auto object-contain"
        />
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-semibold text-[#073c56]">{user?.name ?? 'User'}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#073c56] mb-3">
            Select Your Portal
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Choose which area you want to manage. You can switch between portals at any time.
          </p>
        </div>

        <div className={`grid grid-cols-1 ${canMini && canMain ? 'md:grid-cols-2' : ''} gap-8 w-full max-w-3xl`}>
          {/* Main Stock Card */}
          {canMain && <button
            onClick={() => handleSelect('main')}
            className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-[#073c56] shadow-sm hover:shadow-lg transition-all duration-300 p-10 text-left flex flex-col gap-5 focus:outline-none focus:ring-2 focus:ring-[#073c56]/40"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#073c56]/10 flex items-center justify-center group-hover:bg-[#073c56] transition-colors duration-300">
              <Warehouse
                size={32}
                className="text-[#073c56] group-hover:text-white transition-colors duration-300"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#073c56] mb-2">
                Main Stock
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Manage your warehouse inventory. Track products, record incoming stock from suppliers, and monitor quantities.
              </p>
            </div>

            <ul className="text-xs text-gray-400 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#073c56]/40 inline-block" />
                Products &amp; stock levels
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#073c56]/40 inline-block" />
                Supplier management
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#073c56]/40 inline-block" />
                Stock-in records &amp; deliveries
              </li>
            </ul>

            <div className="mt-auto flex items-center gap-2 text-[#073c56] font-semibold text-sm">
              Enter Main Stock
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>

            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-[#073c56]/10 text-[#073c56] px-2.5 py-1 rounded-full">
              Warehouse
            </span>
          </button>}

          {/* Mini Stock Card */}
          {canMini && <button
            onClick={() => handleSelect('mini')}
            className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-[#073c56] shadow-sm hover:shadow-lg transition-all duration-300 p-10 text-left flex flex-col gap-5 focus:outline-none focus:ring-2 focus:ring-[#073c56]/40"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
              <Briefcase
                size={32}
                className="text-amber-500 group-hover:text-white transition-colors duration-300"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#073c56] mb-2">
                Mini Stock <span className="text-sm font-normal text-gray-400">(Clients)</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Manage equipment for your clients. Track rentals, sales, returns, and calibration tools.
              </p>
            </div>

            <ul className="text-xs text-gray-400 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                Client management
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                Equipment transactions (sell, rent, maintain)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                Stock tracking &amp; returns
              </li>
            </ul>

            <div className="mt-auto flex items-center gap-2 text-[#073c56] font-semibold text-sm">
              Enter Mini Stock
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>

            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">
              Clients
            </span>
          </button>}
        </div>
      </div>
    </div>
  );
}
