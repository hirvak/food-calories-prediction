import { useState, useEffect } from 'react';
import { predictionService } from '../services/predictionService';
import { useToast } from '../context/ToastContext';
import { SkeletonCard } from '../components/Skeletons';
import { getFoodNameFromItem } from '../utils/format';
import { Trash2, Clock, Flame, Scale, Search, Filter, Inbox, AlertTriangle, Edit, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Prediction } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { EditPredictionModal } from '../components/EditPredictionModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function PredictionHistory() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Custom Filters & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [calFilter, setCalFilter] = useState<'all' | 'low' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'calories_desc' | 'calories_asc'>('newest');
  const [pageSize, setPageSize] = useState(6);

  // Deletion Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Edit Modal State
  const [editTarget, setEditTarget] = useState<Prediction | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditTrigger = (item: Prediction) => {
    setEditTarget(item);
    setEditModalOpen(true);
  };

  const handleEditSuccess = (updated: Prediction) => {
    setPredictions((prev) => prev.map((item) => item.id === updated.id ? updated : item));
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await predictionService.getHistory(1, 100);
      setPredictions(data.predictions || []);
    } catch (error: any) {
      console.error(error);
      showToast('Failed to load prediction history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'NutriLens | Meal History';
    fetchHistory();
  }, [showToast]);

  const handleDeleteTrigger = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    setDeletingId(id);
    try {
      await predictionService.deletePrediction(id);
      showToast('Prediction log deleted successfully', 'success');
      fetchHistory();
    } catch (error: any) {
      console.error(error);
      showToast('Failed to delete prediction log', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Client-Side Search and Filter Logic
  const filteredPredictions = predictions
    .filter((item) => getFoodNameFromItem(item).toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => {
      if (calFilter === 'low') return item.calories < 200;
      if (calFilter === 'high') return item.calories >= 200;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'calories_desc') return b.calories - a.calories;
      if (sortBy === 'calories_asc') return a.calories - b.calories;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest
    });

  const totalPages = Math.max(1, Math.ceil(filteredPredictions.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const displayedPredictions = filteredPredictions.slice((activePage - 1) * pageSize, activePage * pageSize);

  // Calculate Nutrition Summary for currently displayed cards (presentation only)
  const totalDisplayCalories = Math.round(filteredPredictions.reduce((acc, item) => acc + item.calories, 0));
  const totalDisplayProtein = Math.round(filteredPredictions.reduce((acc, item) => acc + item.protein, 0));
  const totalDisplayCarbs = Math.round(filteredPredictions.reduce((acc, item) => acc + item.carbohydrates, 0));
  const totalDisplayFat = Math.round(filteredPredictions.reduce((acc, item) => acc + item.fat, 0));

  if (loading && predictions.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full relative animate-fade-in pb-12 text-[#111827]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <PageHeader 
          title="Meal History" 
          description="View and manage your complete meal history logs" 
        />
      </div>

      {/* Header Summary Cards for displayed logs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Page Calories</span>
          <h4 className="text-lg font-bold text-[#111827] mt-1">{totalDisplayCalories} kcal</h4>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Page Carbohydrates</span>
          <h4 className="text-lg font-bold text-[#2563EB] mt-1">{totalDisplayCarbs} g</h4>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Page Protein</span>
          <h4 className="text-lg font-bold text-[#EF4444] mt-1">{totalDisplayProtein} g</h4>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Page Fats</span>
          <h4 className="text-lg font-bold text-[#F59E0B] mt-1">{totalDisplayFat} g</h4>
        </div>
      </div>

      {/* 1. Standardized Filter Bar */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search meal history..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Calorie Filter */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280]">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={calFilter}
              onChange={(e) => {
                setCalFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold text-[#111827] cursor-pointer"
            >
              <option value="all">All Calories</option>
              <option value="low">Low Calories (&lt; 200 kcal)</option>
              <option value="high">High Calories (&gt;= 200 kcal)</option>
            </select>
          </div>

          {/* Sorter */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold text-[#111827] cursor-pointer"
          >
            <option value="newest">Newest Scans</option>
            <option value="oldest">Oldest Scans</option>
            <option value="calories_desc">Highest Calories</option>
            <option value="calories_asc">Lowest Calories</option>
          </select>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold text-[#111827] cursor-pointer"
          >
            <option value={6}>6 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
          </select>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex justify-between items-center text-xs font-bold text-[#6B7280]">
        {filteredPredictions.length > 0 ? (
          <span>
            Showing {Math.min(filteredPredictions.length, (activePage - 1) * pageSize + 1)}–{Math.min(filteredPredictions.length, activePage * pageSize)} of {filteredPredictions.length} {filteredPredictions.length === 1 ? 'result' : 'results'}
          </span>
        ) : (
          <span>No results found</span>
        )}
      </div>

      {/* Grid of history cards */}
      {displayedPredictions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPredictions.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                  deletingId === item.id ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-[#6B7280] tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <h3 className="text-lg font-semibold text-[#111827] truncate mt-1">{getFoodNameFromItem(item)}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Edit button */}
                    <button
                      onClick={() => handleEditTrigger(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit log"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteTrigger(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats values */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#6B7280]">Calories</span>
                      <span className="text-sm font-bold text-[#111827]">{item.calories} kcal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-slate-450" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#6B7280]">Weight</span>
                      <span className="text-sm font-bold text-[#111827]">{item.weight_grams} g</span>
                    </div>
                  </div>
                </div>

                {/* Macro pills */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-around text-xs font-bold">
                  <span className="text-blue-600">C: {item.carbohydrates}g</span>
                  <span className="text-slate-350">•</span>
                  <span className="text-red-500">P: {item.protein}g</span>
                  <span className="text-slate-350">•</span>
                  <span className="text-amber-500">F: {item.fat}g</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </Button>

              <div className="text-xs font-bold text-[#4B5563]">
                Page {activePage} of {totalPages}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={activePage === totalPages}
                className="flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4 bg-white border border-slate-200/80 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-450">
            <Inbox className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-sm font-bold text-[#111827]">No logged meals found</h3>
            <p className="text-xs text-[#6B7280]">Try a different keyword or clear your filters.</p>
          </div>
        </Card>
      )}

      {/* Deletion Confirmation Modal Overlay */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-nutrigo-border rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl text-left animate-slide-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-nutrigo-textPrimary uppercase tracking-wider">Confirm Deletion</h4>
                <p className="text-xs text-nutrigo-textSecondary leading-relaxed font-semibold">Are you sure you want to delete this prediction log from your history? This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 border border-nutrigo-border bg-white text-nutrigo-textSecondary rounded-full text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors"
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Prediction Modal Overlay */}
      <EditPredictionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        prediction={editTarget}
        onUpdateSuccess={handleEditSuccess}
      />
    </div>
  );
}
