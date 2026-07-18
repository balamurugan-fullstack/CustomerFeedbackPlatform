import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, MessageSquarePlus } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const syncAdminState = () => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsAdmin(Boolean(window.localStorage.getItem('customer-feedback-admin')));
  };

  useEffect(() => {
    syncAdminState();
    window.addEventListener('storage', syncAdminState);
    window.addEventListener('focus', syncAdminState);
    return () => {
      window.removeEventListener('storage', syncAdminState);
      window.removeEventListener('focus', syncAdminState);
    };
  }, []);

  useEffect(() => {
    syncAdminState();
  }, [navigate]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
      isActive
        ? 'bg-brand-50 text-brand-700 shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    );

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('customer-feedback-admin');
    }

    setIsAdmin(false);
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
            <MessageSquarePlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">Acowale CRM Machine Test by Balamurugan</p>
            <p className="hidden text-xs text-slate-500 sm:block">Customer feedback intelligence</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1">
          <NavLink to="/" className={linkClass} end>
            <MessageSquarePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
            <span className="sm:hidden">Home</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="sm:hidden">Admin</span>
            </NavLink>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
