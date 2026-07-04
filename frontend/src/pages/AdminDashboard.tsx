import { useState, useEffect, useCallback } from 'react';
import { predictionService } from '../services/predictionService';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { SkeletonCard } from '../components/Skeletons';
import { getFoodNameFromItem } from '../utils/format';
import { Users, Shield, Database, Flame, Award, Clock, Inbox } from 'lucide-react';
import type { AdminDashboardStats, User, Prediction } from '../types';
import { PageHeader } from '../components/ui/PageHeader';


export default function AdminDashboard() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  
  // Dynamic stats calculated from users/all-history endpoints
  const [adminsCount, setAdminsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [globalTimeline, setGlobalTimeline] = useState<Prediction[]>([]);

  const fetchAdminStats = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // 1. Fetch dashboard stats and global history
      const [dashboardStats, historyData] = await Promise.all([
        predictionService.getAdminDashboard(),
        predictionService.getAllHistory(1, 6),
      ]);
      setStats(dashboardStats);

      // Sort global timeline descending by created_at to guarantee newest first
      const sortedTimeline = (historyData.predictions || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setGlobalTimeline(sortedTimeline);

      // 2. Fetch all users page-by-page to accurately count admins/users role composition
      let allUsers: User[] = [];
      
      const firstPage = await userService.getAdminUsers(1, 100);
      allUsers = allUsers.concat(firstPage.users || []);
      const totalRecords = firstPage.total_records || 0;

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

      const admins = allUsers.filter(u => u.role === 'admin').length;
      setAdminsCount(admins);
      setUsersCount(allUsers.length - admins);
    } catch (error: any) {
      console.error(error);
      showToast('Failed to load administrator statistics', 'error');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    document.title = 'NutriLens | Admin Analytics';
    fetchAdminStats();

    // Re-fetch when page is focused/visible to keep stats 100% live
    const handleFocus = () => {
      fetchAdminStats(false);
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchAdminStats]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!stats || stats.total_users === 0) {
    return (
      <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in pb-12 text-[#111827]">
        <PageHeader 
          title="Analytics" 
          description="Audit overall system metrics, user demographics, and database volumes." 
        />
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 gap-4 bg-white border border-slate-100 rounded-3xl p-8 shadow-soft min-h-[350px]">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-350 border border-slate-100 shadow-sm">
            <Inbox className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex flex-col gap-1.5 max-w-sm">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">No Analytics Data Available</h4>
            <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">There are currently no registered users or activity logs on the platform to compute analytics metrics.</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper values for role ratio doughnut chart
  const totalR = adminsCount + usersCount;
  const adminRatio = totalR > 0 ? adminsCount / totalR : 0;
  const doughnutCircumference = 2 * Math.PI * 25;
  const doughnutOffset = doughnutCircumference - (adminRatio * doughnutCircumference);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in pb-12">
      <PageHeader 
        title="Analytics" 
        description="Audit overall system metrics, user demographics, and database volumes." 
      />

      {/* 1. Platforms Statistics Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-soft flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full blur-xl opacity-85 translate-x-4 -translate-y-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider block">Registered Users</span>
              <h4 className="text-lg font-extrabold text-slate-800 mt-0.5">{stats?.total_users ?? 0}</h4>
            </div>
          </div>
        </div>

        {/* Total Admins */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-soft flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-full blur-xl opacity-85 translate-x-4 -translate-y-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-650 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider block">Platform Admins</span>
              <h4 className="text-lg font-extrabold text-slate-800 mt-0.5">{adminsCount}</h4>
            </div>
          </div>
        </div>

        {/* Total Scans */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-soft flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full blur-xl opacity-85 translate-x-4 -translate-y-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-nutrigo-green flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider block">Total Scans Logs</span>
              <h4 className="text-lg font-extrabold text-slate-800 mt-0.5">{stats?.total_predictions ?? 0}</h4>
            </div>
          </div>
        </div>

        {/* Total Calories */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-soft flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-full blur-xl opacity-85 translate-x-4 -translate-y-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-nutrigo-orange flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider block">Scanned Calories</span>
              <h4 className="text-lg font-extrabold text-slate-800 mt-0.5">
                {stats?.total_calories_consumed ? Math.round(stats.total_calories_consumed) : 0} <span className="text-[10px] font-bold text-slate-400">kcal</span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts & System Activity Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Doughnut Chart & Top Food */}
        <div className="flex flex-col gap-6 w-full">
          {/* Role distribution circular gauge */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Role Composition</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Distribution of user accounts vs admin accounts</p>
            </div>
            <div className="border-t border-slate-100"></div>

            <div className="flex items-center justify-around py-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="25" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                  <circle 
                    cx="40" cy="40" r="25" fill="transparent" stroke="#6366f1" strokeWidth="6"
                    strokeDasharray={doughnutCircumference}
                    strokeDashoffset={doughnutOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-extrabold text-slate-700">{Math.round(adminRatio * 100)}%</span>
              </div>

              <div className="flex flex-col gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-slate-600">Admins: {adminsCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span className="text-slate-600">Users: {usersCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Food Item banner */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-5 text-white flex items-center justify-between shadow-md transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-x-4 -translate-y-4"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg">
                <Award className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider">Top Detected Ingredient</span>
                <h4 className="text-lg font-extrabold tracking-tight mt-0.5">{stats?.most_detected_food ? getFoodNameFromItem(stats.most_detected_food) : 'N/A'}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Global Activity timeline */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 flex flex-col gap-4 w-full">
          <div>
            <h4 className="text-sm font-bold text-slate-800">System Activity Feed</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Latest scans logged globally across all user accounts</p>
          </div>
          <div className="border-t border-slate-100"></div>

          {globalTimeline.length > 0 ? (
            <div className="relative pl-6 border-l border-slate-100 flex flex-col gap-6">
              {globalTimeline.map((item) => (
                <div key={item.id} className="relative flex items-start justify-between">
                  <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-nutrigo-green ring-4 ring-primary-50"></span>
                  
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">{getFoodNameFromItem(item)}</span>
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleString()}
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5 font-bold">User ID: #{item.user_id}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-1 rounded-xl flex-shrink-0">
                    <Flame className="text-nutrigo-orange w-3.5 h-3.5" />
                    {item.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 gap-2">
              <Inbox className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-bold text-slate-400">No system scans logs found</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
