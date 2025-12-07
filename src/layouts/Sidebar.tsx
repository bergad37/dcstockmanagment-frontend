import { useState } from 'react';
import {
  Menu,
  LayoutDashboard,
  Users,
  Briefcase,
  ArrowDownUp,
  TrendingUp,
  Settings,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'Users', icon: Users, path: '/users' },
  { title: 'Clients', icon: Briefcase, path: '/clients' },
  { title: 'Products/Equipments', icon: Briefcase, path: '/products' },
  { title: 'Stock In', icon: ArrowDownUp, path: '/stockIn' },
  { title: 'Stock Out', icon: ArrowDownUp, path: '/stockOut' },
  { title: 'Analytics', icon: TrendingUp, path: '/analytics' },
  { title: 'Settings', icon: Settings, path: '/settings' }
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div
      className={`
        bg-primary text-white h-screen transition-all shhadow-lg duration-300 flex flex-col  ${
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
          DC Stock
        </h1>
        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-2">
        {menuItems.map(({ title, icon: Icon, path }) => (
          <Link
            key={title}
            to={path}
            className="
              flex items-center gap-4 px-4 py-3 
              hover:bg-white/10 transition rounded-lg
            "
          >
            <Icon size={22} />
            <span className={`${open ? 'block' : 'hidden'} text-sm`}>
              {title}
            </span>
          </Link>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="mt-auto p-4">
        {' '}
        {/* <-- This pushes logout to the bottom */}
        <button
          className="
          flex items-center gap-4 px-4 py-3 w-full 
          hover:bg-white/10 transition rounded-lg"
          onClick={logout}
        >
          <LogOut size={22} />
          <span className={`${open ? 'block' : 'hidden'} text-sm`}>Logout</span>
        </button>
      </div>
    </div>
  );
}
