import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // Generate simple breadcrumbs list based on pathname
  const getBreadcrumbs = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ label: 'App', path: '#' }];
    
    return segments.map((seg, idx) => {
      const path = '/' + segments.slice(0, idx + 1).join('/');
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace('-', ' ');
      return { label, path };
    });
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-5 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Toggle sidebar button for mobile viewports */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Breadcrumbs / Page Titles */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="hidden sm:inline hover:text-slate-600 cursor-pointer">NutriLens</span>
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.path} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-350" />
              <span className={idx === breadcrumbs.length - 1 ? "text-slate-800" : "hover:text-slate-600 cursor-pointer capitalize"}>
                {crumb.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon Placeholder */}
        <button 
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
        </button>

        <div className="w-[1px] h-6 bg-slate-200/60"></div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-2.5">
          {user?.role === 'admin' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-100">
              Admin
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100">
              User
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase border border-slate-200">
            {user?.name.substring(0, 2)}
          </div>
          <span className="hidden md:inline text-xs font-bold text-slate-700 capitalize">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
