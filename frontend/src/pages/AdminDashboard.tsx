import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { SkeletonCard } from '../components/Skeletons';
import { getFoodNameFromItem } from '../utils/format';
import { Users, Shield, Database, Flame, Award, Clock, Inbox, User as UserIcon } from 'lucide-react';
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
  const [usersMap, setUsersMap] = useState<Record<number, string>>({});

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

      // Create a mapping of user_id -> name
      const map: Record<number, string> = {};
      allUsers.forEach(u => {
        if (u.id !== undefined) {
          map[u.id] = u.name;
        }
      });
      setUsersMap(map);
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
  const doughnutRadius = 32;
  const doughnutCircumference = 2 * Math.PI * doughnutRadius;
  const doughnutOffset = doughnutCircumference - (adminRatio * doughnutCircumference);

  // Helper function to format timestamp in the System Activity Feed
  const formatScanTimestamp = (dateString: string) => {
    const dateObj = new Date(dateString);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    return `${day} ${month} ${year}`;
  };



  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col text-left mb-4 gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] font-semibold mb-0.5 select-none">
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[#4B5563]">Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 font-normal leading-relaxed max-w-2xl">
          Audit overall system metrics, user demographics, and database volumes across the NutriLens platform.
        </p>
      </div>

      {/* 1. Platforms Statistics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white border border-slate-100/85 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[120px] transition-all duration-300 hover:shadow-md hover:border-slate-200/60 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">Registered Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all group-hover:bg-blue-100/80">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <h4 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
            {stats?.total_users ?? 0}
          </h4>
        </div>

        {/* Total Admins */}
        <div className="bg-white border border-slate-100/85 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[120px] transition-all duration-300 hover:shadow-md hover:border-slate-200/60 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">Platform Admins</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center transition-all group-hover:bg-indigo-100/80">
              <Shield className="w-4.5 h-4.5" />
            </div>
          </div>
          <h4 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
            {adminsCount}
          </h4>
        </div>

        {/* Total Scans */}
        <div className="bg-white border border-slate-100/85 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[120px] transition-all duration-300 hover:shadow-md hover:border-slate-200/60 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">Scan Logs</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-all group-hover:bg-emerald-100/80">
              <Database className="w-4.5 h-4.5" />
            </div>
          </div>
          <h4 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
            {stats?.total_predictions ?? 0}
          </h4>
        </div>

        {/* Total Calories */}
        <div className="bg-white border border-slate-100/85 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[120px] transition-all duration-300 hover:shadow-md hover:border-slate-200/60 hover:-translate-y-0.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">Calories Scanned</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center transition-all group-hover:bg-amber-100/80">
              <Flame className="w-4.5 h-4.5" />
            </div>
          </div>
          <h4 className="text-3xl font-bold tracking-tight text-slate-900 leading-none flex items-baseline gap-1">
            {stats?.total_calories_consumed ? Math.round(stats.total_calories_consumed).toLocaleString() : 0}
            <span className="text-xs font-semibold text-slate-400">kcal</span>
          </h4>
        </div>
      </div>

      {/* 2. Charts & System Activity Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Doughnut Chart, Top Food, Quick Insights */}
        <div className="flex flex-col gap-6 w-full">
          {/* Role distribution circular gauge */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/60 hover:-translate-y-0.5 flex flex-col gap-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Role Composition</h4>
              <p className="text-xs text-slate-400 mt-0.5">Distribution of user accounts vs admin accounts</p>
            </div>
            <div className="border-t border-slate-100/85"></div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="32" fill="transparent" stroke="#f8fafc" strokeWidth="8" />
                  <circle 
                    cx="48" cy="48" r="32" fill="transparent" stroke="#3b82f6" strokeWidth="8"
                    strokeDasharray={doughnutCircumference}
                    strokeDashoffset={doughnutOffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-700 leading-none">{Math.round(adminRatio * 100)}%</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Admins</span>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-4 sm:gap-3 text-xs font-semibold justify-center sm:justify-start w-full sm:w-auto">
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 sm:p-0 sm:bg-transparent rounded-xl border border-slate-100 sm:border-transparent">
                  <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></span>
                  <div className="flex flex-col text-left">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Admins</span>
                    <span className="text-slate-800 font-bold text-sm leading-none mt-0.5">{adminsCount} Accounts</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 sm:p-0 sm:bg-transparent rounded-xl border border-slate-100 sm:border-transparent">
                  <span className="w-3 h-3 rounded-full bg-slate-200 flex-shrink-0"></span>
                  <div className="flex flex-col text-left">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Users</span>
                    <span className="text-slate-800 font-bold text-sm leading-none mt-0.5">{usersCount} Accounts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Food Item card */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex items-center justify-between shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden h-[120px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl translate-x-4 -translate-y-4"></div>
            
            <div className="flex flex-col text-left justify-center h-full z-10">
              <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">Top Detected Food</span>
              <h3 className="text-2xl font-extrabold tracking-tight text-white mt-2 leading-none">
                {stats?.most_detected_food ? getFoodNameFromItem(stats.most_detected_food) : 'No scans logged'}
              </h3>
            </div>
            
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 z-10 flex-shrink-0 self-start mt-1">
              <Award className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Right Column: Global Activity timeline */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/60 hover:-translate-y-0.5 flex flex-col gap-6 w-full h-full justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">System Activity Feed</h4>
                <p className="text-xs text-slate-400 mt-0.5">Latest scans logged globally across all user accounts</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="border-t border-slate-100/85 mt-4 mb-2"></div>

            {globalTimeline.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {globalTimeline.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50/70 transition-all duration-200 group/row"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-slate-50 text-slate-455 flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover/row:bg-blue-50 group-hover/row:text-blue-500 group-hover/row:border-blue-100/50 transition-colors">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-[13px] font-bold text-slate-800 truncate">{getFoodNameFromItem(item)}</span>
                        <span className="text-[10px] font-medium text-slate-450 flex items-center gap-1.5 mt-1">
                          <span className="capitalize">{usersMap[item.user_id] || `User #${item.user_id}`}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>{formatScanTimestamp(item.created_at)}</span>
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center justify-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg flex-shrink-0 h-7 group-hover/row:bg-white group-hover/row:border-slate-200 transition-colors">
                      <Flame className="text-amber-500 w-3.5 h-3.5" />
                      {item.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                  <Inbox className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex flex-col gap-1 max-w-xs">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">No scan logs</h4>
                  <p className="text-[11px] text-slate-400 font-medium">No system scans have been performed yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
