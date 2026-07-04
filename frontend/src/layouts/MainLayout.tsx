import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-nutrigo-bg flex font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col lg:pl-[220px] min-w-0">
        {/* Mobile menu toggle header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-nutrigo-border lg:hidden">
          <span className="font-bold text-nutrigo-textPrimary">NutriLens Dashboard</span>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-nutrigo-textSecondary hover:text-nutrigo-textPrimary focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-grow p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
