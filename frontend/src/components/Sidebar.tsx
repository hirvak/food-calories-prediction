import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './ui/Logo';
import { 
  LayoutDashboard, 
  Compass, 
  Heart, 
  Brain, 
  LogOut,
  ShieldCheck,
  Users,
  Database,
  Activity,
  FileText
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

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
        className={`fixed top-0 bottom-0 left-0 z-45 w-[220px] bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
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

            <NavLink to="/profile" onClick={() => setIsOpen(false)} className={linkClass}>
              <Brain className="w-4.5 h-4.5" />
              <span>Profile</span>
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

        {/* Footer profile & logout */}
        <div className="p-4 border-t border-slate-800 flex flex-col gap-3 bg-slate-900/20">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] uppercase border border-slate-800 shadow-sm flex-shrink-0">
              {user?.name.substring(0, 2)}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-bold text-slate-200 truncate leading-none capitalize">{user?.name}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate mt-0.5 leading-none">{user?.role} Role</span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-450 text-xs font-bold hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/40 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
