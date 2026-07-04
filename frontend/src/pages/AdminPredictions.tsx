import { useState, useEffect, useCallback } from 'react';
import { predictionService } from '../services/predictionService';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { getFoodNameFromItem } from '../utils/format';
import { 
  Search, 
  Filter, 
  Trash2, 
  Inbox, 
  AlertTriangle,
  X,
  Egg,
  Beef,
  Wheat,
  Cookie,
  Edit,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import type { Prediction, User as UserType } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { EditPredictionModal } from '../components/EditPredictionModal';

interface EnrichedPrediction extends Prediction {
  userName: string;
  userEmail: string;
}

export default function AdminPredictions() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [usersMap, setUsersMap] = useState<Map<number, UserType>>(new Map());
  
  // Pagination & limits
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Search, Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [calFilter, setCalFilter] = useState<'all' | 'low' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'calories_desc' | 'calories_asc' | 'confidence_desc'>('newest');

  // Interactive Overlays
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<EnrichedPrediction | null>(null);

  // Edit Modal State
  const [editTarget, setEditTarget] = useState<Prediction | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditTrigger = (item: Prediction) => {
    setEditTarget(item);
    setEditModalOpen(true);
  };

  const handleEditSuccess = (updated: Prediction) => {
    setPredictions((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    
    // Update selectedPrediction specs if it's currently open for this item
    if (selectedPrediction && selectedPrediction.id === updated.id) {
      setSelectedPrediction({
        ...selectedPrediction,
        ...updated
      });
    }
  };

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [historyData, usersData] = await Promise.all([
        predictionService.getAllHistory(1, 100),
        userService.getAdminUsers(1, 100)
      ]);

      setPredictions(historyData.predictions || []);

      let allUsers: UserType[] = usersData.users || [];
      const totalRecords = usersData.total_records || 0;

      if (totalRecords > 100) {
        const totalPages = Math.ceil(totalRecords / 100);
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(userService.getAdminUsers(p, 100));
        }
        const results = await Promise.all(promises);
        results.forEach(res => {
          allUsers = allUsers.concat(res.users || []);
        });
      }

      const uMap = new Map<number, UserType>();
      allUsers.forEach((u: UserType) => {
        uMap.set(u.id, u);
      });
      setUsersMap(uMap);
    } catch (error: any) {
      console.error(error);
      showToast('Failed to load global predictions logs', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    document.title = 'NutriLens | Meal Analysis Logs';
    fetchAdminData();
  }, [fetchAdminData]);

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
      showToast('Prediction record deleted successfully', 'success');
      fetchAdminData();
    } catch (error: any) {
      console.error(error);
      showToast('Failed to delete prediction record', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const enrichedPredictions: EnrichedPrediction[] = predictions.map(p => {
    const u = usersMap.get(Number(p.user_id));
    return {
      ...p,
      userName: u ? u.name : `User #${p.user_id}`,
      userEmail: u ? u.email : 'N/A'
    };
  });

  const filteredPredictions = enrichedPredictions
    .filter(p => {
      const term = searchTerm.toLowerCase();
      return (
        getFoodNameFromItem(p).toLowerCase().includes(term) ||
        p.userName.toLowerCase().includes(term) ||
        p.userEmail.toLowerCase().includes(term) ||
        p.user_id.toString().includes(term) ||
        p.id.toString().includes(term)
      );
    })
    .filter(p => {
      if (calFilter === 'low') return p.calories < 200;
      if (calFilter === 'high') return p.calories >= 200;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'calories_desc') return b.calories - a.calories;
      if (sortBy === 'calories_asc') return a.calories - b.calories;
      if (sortBy === 'confidence_desc') return b.confidence - a.confidence;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest
    });

  const totalPages = Math.max(1, Math.ceil(filteredPredictions.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const displayedPredictions = filteredPredictions.slice((activePage - 1) * pageSize, activePage * pageSize);

  if (loading && predictions.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div className="h-10 w-48 skeleton-shimmer rounded-xl"></div>
        <div className="bg-white h-[300px] w-full rounded-2xl skeleton-shimmer"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <PageHeader 
          title="Meal Analysis Logs" 
          description="Audit food meal analysis logs and user consumption records" 
        />
      </div>

      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by food, user, email or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all duration-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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
            <option value="confidence_desc">Highest Confidence</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold text-[#111827] cursor-pointer"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-bold text-[#6B7280]">
        {filteredPredictions.length > 0 ? (
          <span>
            Showing {Math.min(filteredPredictions.length, (activePage - 1) * pageSize + 1)}–{Math.min(filteredPredictions.length, activePage * pageSize)} of {filteredPredictions.length} {filteredPredictions.length === 1 ? 'result' : 'results'}
          </span>
        ) : (
          <span>No results found</span>
        )}
      </div>

      <Card className="w-full flex flex-col gap-6 px-0 md:px-0 pb-4">
        {displayedPredictions.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm font-medium text-[#4B5563]">
              <thead>
                <tr className="bg-slate-50/50 text-[#6B7280] font-semibold uppercase tracking-wider border-b border-slate-200 text-xs">
                  <th className="py-2.5 pl-6 pr-3">ID</th>
                  <th className="py-2.5 px-3">User Mapped</th>
                  <th className="py-2.5 px-3">Ingredient</th>
                  <th className="py-2.5 px-3 text-right">Weight</th>
                  <th className="py-2.5 px-3 text-right">Calories</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Scan Date</th>
                  <th className="py-2.5 pr-6 pl-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedPredictions.map((item) => (
                  <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${deletingId === item.id ? 'opacity-50' : ''}`}>
                    <td className="py-3 pl-6 pr-3 font-semibold text-slate-400">#{item.id}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-[#111827] capitalize">{item.userName}</span>
                        <span className="text-[10px] text-slate-450 mt-0.5">{item.userEmail}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#111827]">{getFoodNameFromItem(item)}</td>
                    <td className="py-3 px-3 text-right">{item.weight_grams} g</td>
                    <td className="py-3 px-3 text-right font-extrabold text-[#111827]">{item.calories} kcal</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.confidence >= 0.8 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : item.confidence >= 0.5 
                            ? 'bg-amber-50 text-amber-700' 
                            : 'bg-red-50 text-red-700'
                      }`}>
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs font-semibold text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-6 pl-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditTrigger(item)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-slate-450 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit prediction details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrigger(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-slate-450 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 mt-2 px-5 pb-1">
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-slate-400 gap-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-350">
              <Inbox className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex flex-col gap-1 max-w-xs">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">No Predictions Logged</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1 leading-relaxed">No matching food records or audit logs were found under the current filters.</p>
            </div>
          </div>
        )}
      </Card>

      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl text-left animate-slide-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Delete prediction log</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">Are you sure you want to delete this prediction log? This updates global calorie history counters and datasets.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 border border-slate-250 bg-white text-slate-500 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors"
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

      {/* Details drawer (modal) */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full relative z-10 shadow-xl text-left animate-slide-in flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Specs ID: #{selectedPrediction.id}</span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{getFoodNameFromItem(selectedPrediction)} Details</h3>
              </div>
              <button 
                onClick={() => setSelectedPrediction(null)}
                className="text-slate-455 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {/* User details */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Mapped User Details</span>
                <span className="text-xs font-bold text-slate-800 capitalize mt-1">{selectedPrediction.userName}</span>
                <span className="text-[10px] font-semibold text-slate-500">{selectedPrediction.userEmail}</span>
                <span className="text-[9px] font-semibold text-slate-400 mt-0.5">UID: #{selectedPrediction.user_id}</span>
              </div>

              {/* Nutrition breakdown */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Nutrition Parameters</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  {/* Protein */}
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-2.5 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                      <Egg className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">Protein</span>
                      <span className="text-xs font-bold text-slate-700">{selectedPrediction.protein}g</span>
                    </div>
                  </div>
                  {/* Fat */}
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-2.5 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Beef className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">Fat</span>
                      <span className="text-xs font-bold text-slate-700">{selectedPrediction.fat}g</span>
                    </div>
                  </div>
                  {/* Carbohydrates */}
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-2.5 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                      <Wheat className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">Carbohydrates</span>
                      <span className="text-xs font-bold text-slate-700">{selectedPrediction.carbohydrates}g</span>
                    </div>
                  </div>
                  {/* Sugar */}
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-2.5 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
                      <Cookie className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">Sugar</span>
                      <span className="text-xs font-bold text-slate-700">{selectedPrediction.sugar}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
              <Button
                onClick={() => setSelectedPrediction(null)}
                className="rounded-full"
              >
                Close Specs
              </Button>
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
