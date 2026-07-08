import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './ui/Logo';
import { 
  LayoutDashboard, 
  Compass, 
  Heart, 
  ShieldCheck,
  Users,
  Database,
  Activity,
  FileText,
  ChevronUp
} from 'lucide-react';


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard Escape key handler to close dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  // Active state: Blue bg with white text
  // Hover state: bg-slate-800/60 text-slate-100
  const linkClass = ({ isActive }: { isActive: boolean }) => {
    const base = "flex items-center gap-3 px-3.5 h-9 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none";
    if (isActive) {
      return `${base} bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.01]`;
    }
    return `${base} text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 hover:translate-x-0.5`;
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 w-[220px] bg-[#152033] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-5 px-4.5 py-5 overflow-y-auto flex-grow">
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 px-1.5 pb-0.5">
            <Logo size={30} />
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold leading-none text-slate-100">NutriLens</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1 block leading-none">Smart Nutrition Analytics</span>
            </div>
          </div>

          <div className="border-b border-slate-800"></div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5">
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={linkClass}>
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/predict" onClick={() => setIsOpen(false)} className={linkClass}>
              <Compass className="w-4.5 h-4.5" />
              <span>Meal Analysis</span>
            </NavLink>

            <NavLink to="/history" onClick={() => setIsOpen(false)} className={linkClass}>
              <Heart className="w-4.5 h-4.5" />
              <span>Meal History</span>
            </NavLink>

            <NavLink to="/bmi-calculator" onClick={() => setIsOpen(false)} className={linkClass}>
              <Activity className="w-4.5 h-4.5" />
              <span>BMI Calculator</span>
            </NavLink>

            <NavLink to="/reports" onClick={() => setIsOpen(false)} className={linkClass}>
              <FileText className="w-4.5 h-4.5" />
              <span>Reports</span>
            </NavLink>

            {/* Admin Links */}
            {isAdmin && (
              <div className="flex flex-col gap-1.5 mt-4.5 pt-4.5 border-t border-slate-800">
                <span className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Admin Section</span>
                
                <NavLink to="/admin" onClick={() => setIsOpen(false)} className={linkClass}>
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>Analytics</span>
                </NavLink>

                <NavLink to="/admin/users" onClick={() => setIsOpen(false)} className={linkClass}>
                  <Users className="w-4.5 h-4.5" />
                  <span>Users</span>
                </NavLink>

                <NavLink to="/admin/predictions" onClick={() => setIsOpen(false)} className={linkClass}>
                  <Database className="w-4.5 h-4.5" />
                  <span>Meal Analysis Logs</span>
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        {/* Footer profile & menu */}
        <div ref={dropdownRef} className="p-4 border-t border-slate-800 bg-slate-900/20 relative">
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/45 overflow-hidden z-50 animate-slide-up-fade origin-bottom">
              <div className="p-1.5 flex flex-col gap-0.5">
                <Link
                  to="/profile"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-start px-3 py-2 text-xs font-bold text-slate-100 hover:bg-slate-800/60 hover:text-slate-100 rounded-lg transition-all duration-150 cursor-pointer text-left w-full"
                >
                  Profile
                </Link>
                <div className="h-[1px] bg-slate-800/80 my-1 mx-1"></div>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                    window.location.href = '/login';
                  }}
                  className="flex items-center justify-start px-3 py-2 text-xs font-bold text-slate-100 hover:bg-rose-950/20 hover:text-rose-400 rounded-lg transition-all duration-150 cursor-pointer text-left w-full"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Clickable Profile Trigger */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-1.5 py-1.5 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-800/30 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] outline-none focus-visible:ring-1 focus-visible:ring-slate-700"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] uppercase border border-slate-800 shadow-sm flex-shrink-0">
                {user?.name.substring(0, 2)}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-bold text-slate-200 truncate leading-none capitalize">{user?.name}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate mt-0.5 leading-none">{user?.role} Role</span>
              </div>
            </div>
            <ChevronUp 
              className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-slate-200' : ''
              }`} 
            />
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
