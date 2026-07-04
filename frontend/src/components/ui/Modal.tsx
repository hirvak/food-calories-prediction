import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 max-w-md w-full relative z-10 shadow-xl text-left animate-slide-in">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h4>
          <button 
            onClick={onClose}
            className="text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
