import { useState } from 'react';
import {
  Menu,
  LayoutDashboard,
  Users,
  Briefcase,
  ArrowDownUp,
  //   TrendingUp,
  Settings,

} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'Users', icon: Users, path: '/users' },
  { title: 'Clients', icon: Briefcase, path: '/clients' },
  { title: 'Products/Equipments', icon: Briefcase, path: '/products' },
  { title: 'Stock', icon: ArrowDownUp, path: '/stock' },
  //   { title: 'Stock Out', icon: ArrowDownUp, path: '/stockOut' },
  //   { title: 'Analytics', icon: TrendingUp, path: '/analytics' },
  { title: 'Settings', icon: Settings, path: '/settings' }
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation(); // <--- NEW

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
          {/* DC Stock */}
          <img
            alt="dc survey ltd logo Company Logo"
            src="https://res.cloudinary.com/ds04ivdrj/image/upload/v1764616773/dclogonobackground_sclmul.png"
            className="mx-auto h-40 w-40 sm:h-20 sm:w-40 object-cover"
          />
        </h1>
        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-2">
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

      {/* (logout moved to top-bar avatar) */}
      <div className="mt-4" />
    </div>
  );
}
