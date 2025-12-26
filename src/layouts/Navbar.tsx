import { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Modal from '../components/ui/Modal';
import { isTokenExpired } from '../utils/auth';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

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
      <h2 className="font-semibold text-primary">Dashboard</h2>

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
            className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 overflow-hidden"
          >
            <div className="p-3 border-b">
              <div className="text-sm font-medium">{user?.name ?? 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email ?? ''}</div>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
              >
                <LogOut size={16} /> <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

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
