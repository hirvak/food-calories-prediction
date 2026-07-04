import React, { useState, useEffect } from 'react';
import { predictionService } from '../services/predictionService';
import { useToast } from '../context/ToastContext';
import { X, Loader2 } from 'lucide-react';
import type { Prediction } from '../types';

interface EditPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: Prediction | null;
  onUpdateSuccess: (updated: Prediction) => void;
}

export function EditPredictionModal({
  isOpen,
  onClose,
  prediction,
  onUpdateSuccess,
}: EditPredictionModalProps) {
  const { showToast } = useToast();
  const [foodName, setFoodName] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ foodName?: string; weight?: string }>({});

  useEffect(() => {
    if (prediction) {
      setFoodName(prediction.food_name);
      setWeight(prediction.weight_grams);
      setErrors({});
    }
  }, [prediction, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !prediction) return null;

  const validate = () => {
    const newErrors: { foodName?: string; weight?: string } = {};
    if (!foodName.trim()) {
      newErrors.foodName = 'Food name is required';
    }
    if (weight === '' || isNaN(weight)) {
      newErrors.weight = 'Weight is required';
    } else if (weight <= 0) {
      newErrors.weight = 'Weight must be greater than zero';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const response = await predictionService.updatePrediction(
        prediction.id,
        foodName.trim(),
        Number(weight)
      );
      
      showToast(response.message || 'Prediction updated successfully', 'success');
      onUpdateSuccess(response.prediction);
      onClose();
    } catch (error: any) {
      console.error(error);
      const backendMessage = error.response?.data?.detail;
      const status = error.response?.status;

      if (status === 404) {
        showToast('Prediction not found.', 'error');
      } else if (status === 403) {
        showToast('You are not authorized to edit this prediction.', 'error');
      } else if (backendMessage && backendMessage.toLowerCase().includes('food not found')) {
        showToast('Selected food does not exist.', 'error');
      } else {
        showToast('Unable to update prediction. Please try again.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          if (!isSaving) onClose();
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl z-10 overflow-hidden transform transition-all duration-300 animate-scale-in text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Correct AI Prediction</h3>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          
          {/* Food Name input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="edit-food-name">
              Food Name
            </label>
            <input
              id="edit-food-name"
              type="text"
              disabled={isSaving}
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className={`w-full px-4 py-2 mt-1 rounded-xl border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 transition-all ${
                errors.foodName 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                  : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
              }`}
              placeholder="e.g. Biryani"
            />
            {errors.foodName && (
              <span className="text-[9px] font-bold text-red-500 mt-1">{errors.foodName}</span>
            )}
          </div>

          {/* Portion Weight input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="edit-weight">
              Weight (grams)
            </label>
            <div className="relative mt-1">
              <input
                id="edit-weight"
                type="number"
                disabled={isSaving}
                value={weight}
                onChange={(e) => {
                  const val = e.target.value;
                  setWeight(val === '' ? '' : Number(val));
                }}
                className={`w-full pl-4 pr-10 py-2 rounded-xl border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 transition-all ${
                  errors.weight 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                    : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                }`}
                placeholder="100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">g</span>
            </div>
            {errors.weight && (
              <span className="text-[9px] font-bold text-red-500 mt-1">{errors.weight}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
