import { useEffect, useRef, useState } from 'react';
import { LogOut, Warehouse, Briefcase, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePortalStore } from '../store/portalStore';
import Modal from '../components/ui/Modal';
import { isTokenExpired } from '../utils/auth';
import ChangePasswordModal from '../components/ChangePasswordModal';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const activePortal = usePortalStore((s) => s.activePortal);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // session-expired modal state
  const [sessionExpired, setSessionExpired] = useState(false);

  // on mount: check token expiry
  useEffect(() => {
    if (isTokenExpired()) {
      setSessionExpired(true);
    }

    const handler = () => setSessionExpired(true);
    window.addEventListener('sessionExpired', handler as EventListener);
    return () => window.removeEventListener('sessionExpired', handler as EventListener);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleConfirmLogin = () => {
    setSessionExpired(false);
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : 'U';

  return (
    <div className="w-full bg-white shadow h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-primary">Dashboard</h2>
        {activePortal && (
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              activePortal === 'main'
                ? 'bg-[#073c56]/10 text-[#073c56]'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {activePortal === 'main' ? (
              <Warehouse size={12} />
            ) : (
              <Briefcase size={12} />
            )}
            {activePortal === 'main' ? 'Main Stock' : 'Mini Stock'}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="flex items-center gap-4">
          <button
            aria-label="Profile"
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-semibold text-white"
          >
            {initials}
          </button>
        </div>

        {open && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* User info header */}
            <div className="px-4 py-4 bg-[#073c56]/5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#073c56] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email ?? ''}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2 space-y-0.5">
              <button
                onClick={() => { setOpen(false); setShowChangePassword(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 bg-white hover:bg-[#073c56]/5 hover:text-[#073c56] transition text-sm font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <KeyRound size={14} />
                </div>
                Change Password
              </button>

              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500  bg-white hover:bg-red-50 transition text-sm font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <LogOut size={14} />
                </div>
                Logout
              </button>
            </div>

            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
              <p className="text-[10px] text-gray-400 text-center">DC Stock Management</p>
            </div>
          </div>
        )}
      </div>

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      <Modal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
        closable={false}
        title={
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">DC Stock</div>
            <div className="text-lg font-semibold">Session expired</div>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-gray-700 text-center mb-6">
            Your session has expired. Please click the button below to log in again.
          </p>

          <div className="flex justify-end">
            <button
              onClick={handleConfirmLogin}
              className="bg-primary hover:opacity-90 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
