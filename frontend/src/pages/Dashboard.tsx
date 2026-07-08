import { useState, useEffect } from 'react';
import { predictionService } from '../services/predictionService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { getFoodNameFromItem } from '../utils/format';
import { 
  Flame, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Award, 
  Inbox,
  Compass,
  Brain,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import type { DashboardAnalyticsResponse } from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';



// Helper welcome message greeting based on hour
const getGreeting = () => {
  const hr = new Date().getHours();
  if (hr < 12) return 'Good Morning';
  if (hr < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// Reusable StatisticsCard Component
interface StatisticsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
}

function StatisticsCard({ icon, title, value, subtitle }: StatisticsCardProps) {
  return (
    <Card className="flex flex-col justify-between p-6 hover:scale-[1.01] hover:shadow-md transition-all duration-300 border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_20px_-2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex flex-col text-left">
        <span className="text-2xl font-bold text-[#111827]">{value}</span>
        {subtitle && <span className="text-xs text-[#6B7280] font-medium mt-1.5 leading-tight">{subtitle}</span>}
      </div>
    </Card>
  );
}

// Reusable WeeklyTrendChart Component
interface WeeklyTrendChartProps {
  data: { day: string; calories: number }[];
}

function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Activity className="w-8 h-8 mb-2 text-slate-300" />
        <span className="text-xs font-bold">No trend activity available.</span>
      </div>
    );
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="day" 
            stroke="#94a3b8" 
            fontSize={10} 
            fontWeight="bold"
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            fontWeight="bold"
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
            labelStyle={{ color: '#64748b' }}
          />
          <Line 
            type="monotone" 
            dataKey="calories" 
            stroke="#2563eb" 
            strokeWidth={3} 
            dot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6 }} 
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Reusable MacronutrientChart Component
interface MacronutrientChartProps {
  data: { protein: number; fat: number; carbohydrates: number };
}

function MacronutrientChart({ data }: MacronutrientChartProps) {
  const total = data.protein + data.fat + data.carbohydrates;
  
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Activity className="w-8 h-8 mb-2 text-slate-300" />
        <span className="text-xs font-bold">No distribution data available.</span>
      </div>
    );
  }

  const chartData = [
    { name: 'Protein', value: data.protein, color: '#2563EB' },
    { name: 'Fat', value: data.fat, color: '#EF4444' },
    { name: 'Carbohydrates', value: data.carbohydrates, color: '#F59E0B' }
  ];

  return (
    <div className="h-64 w-full flex flex-col items-center justify-between">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`${value}g (${Math.round((value / total) * 100)}%)`, 'Amount']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-500 justify-center">
        {chartData.map((item) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div key={item.name} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span>{item.name} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Reusable TopFoodsCard Component
interface TopFoodsCardProps {
  topFoods: { food_name: string; count: number }[];
}

function TopFoodsCard({ topFoods }: TopFoodsCardProps) {
  if (!topFoods || topFoods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Inbox className="w-8 h-8 mb-2 text-slate-350" />
        <span className="text-xs font-bold">No top foods logged.</span>
      </div>
    );
  }

  const maxCount = Math.max(...topFoods.map(f => f.count), 1);

  return (
    <div className="flex flex-col gap-4">
      {topFoods.slice(0, 5).map((item, idx) => {
        const pct = (item.count / maxCount) * 100;
        return (
          <div key={idx} className="flex flex-col gap-1 text-left bg-slate-50/50 border border-slate-100 rounded-2xl p-3">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
              <span>{getFoodNameFromItem(item)}</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{item.count} Times</span>
            </div>
            <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden mt-1.5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${pct}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Reusable RecentActivityTimeline Component
interface RecentActivityTimelineProps {
  activities: { food: string; calories: number; confidence: number; time: string }[];
}

function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Inbox className="w-8 h-8 mb-2 text-slate-355" />
        <span className="text-xs font-bold">No activity available. Start predicting foods to see analytics.</span>
      </div>
    );
  }

  return (
    <div className="relative pl-5 border-l border-slate-200 flex flex-col gap-4 text-left">
      {activities.slice(0, 4).map((item, idx) => (
        <div key={idx} className="relative group animate-fade-in-up">
          {/* Timeline dot */}
          <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300"></span>
          
          <div className="bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 shadow-sm hover:scale-[1.01] transition-transform duration-300">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
              <span>{getFoodNameFromItem(item)}</span>
              <span className="text-[10px] text-blue-600">{item.calories} kcal</span>
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold mt-1">
              <span>Confidence: {Math.round(item.confidence * 100)}%</span>
              <span>{item.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Reusable SummaryPanel Component
interface SummaryPanelProps {
  averageCalories: number;
  averageConfidence: number;
  highestCalorieMeal: { food: string; calories: number } | null;
  lowestCalorieMeal: { food: string; calories: number } | null;
}

function SummaryPanel({ averageCalories, averageConfidence, highestCalorieMeal, lowestCalorieMeal }: SummaryPanelProps) {
  return (
    <Card className="flex flex-col gap-4 text-left border border-slate-200/80 bg-white/70 backdrop-blur-md p-4 md:p-5 h-full justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-blue-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Summary Statistics</h4>
        </div>

        <div className="border-t border-slate-100"></div>

        <div className="flex flex-col gap-3.5 text-xs font-semibold text-slate-600">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Average Daily Calories</span>
            <span className="text-slate-800 font-extrabold">{Math.round(averageCalories)} kcal</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Average Match Accuracy</span>
            <span className="text-slate-800 font-extrabold">{Math.round(averageConfidence * 100)}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Highest Calorie Meal</span>
            <div className="flex flex-col text-right">
              <span className="text-slate-800 font-extrabold">{highestCalorieMeal ? getFoodNameFromItem(highestCalorieMeal) : 'None'}</span>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5">{highestCalorieMeal?.calories ?? 0} kcal</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Lowest Calorie Meal</span>
            <div className="flex flex-col text-right">
              <span className="text-slate-800 font-extrabold">{lowestCalorieMeal ? getFoodNameFromItem(lowestCalorieMeal) : 'None'}</span>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5">{lowestCalorieMeal?.calories ?? 0} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
const formatLastLoggedRelative = (dateStr: string | null | undefined) => {
  if (!dateStr) return 'Never';
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cleanDateStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0];
    const [year, month, day] = cleanDateStr.split('-').map(Number);
    const logDate = new Date(year, month - 1, day);
    logDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - logDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';

    const dayFormatted = String(day).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthFormatted = months[month - 1];
    return `${dayFormatted} ${monthFormatted} ${year}`;
  } catch (e) {
    return dateStr || 'Never';
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Loading & Analytics states
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null);

  useEffect(() => {
    document.title = 'NutriLens | Dashboard';
    const fetchDashboardAnalytics = async () => {
      setLoading(true);
      try {
        const response = await predictionService.getDashboardAnalytics();
        setAnalytics(response);
      } catch (error: any) {
        console.error(error);
        showToast('Failed to load dashboard analytics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAnalytics();
  }, [showToast]);

  if (loading || !analytics) {
    return (
      <div className="flex flex-col gap-6 w-full animate-fade-in max-w-7xl mx-auto text-left">
        {/* Welcome Section Skeleton */}
        <div className="flex flex-col gap-2 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
          <div className="h-6 w-56 skeleton-shimmer rounded-xl"></div>
          <div className="h-4.5 w-96 skeleton-shimmer rounded-xl mt-1.5"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-32 skeleton-shimmer rounded-3xl border border-slate-200/60 dark:border-slate-800"></div>
          <div className="h-32 skeleton-shimmer rounded-3xl border border-slate-200/60 dark:border-slate-800"></div>
          <div className="h-32 skeleton-shimmer rounded-3xl border border-slate-200/60 dark:border-slate-800"></div>
          <div className="h-32 skeleton-shimmer rounded-3xl border border-slate-200/60 dark:border-slate-800"></div>
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[320px] skeleton-shimmer rounded-3xl border border-slate-200/60 dark:border-slate-800"></div>
          <div className="h-[320px] skeleton-shimmer rounded-3xl border border-slate-200/60 dark:border-slate-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in max-w-7xl mx-auto pb-12 text-[#111827]">
      <PageHeader 
        title="Dashboard" 
        description="Monitor your daily nutritional metrics, progress charts, and platform shortcuts." 
      />

      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left bg-gradient-to-r from-blue-50/40 via-emerald-50/10 to-transparent p-6 rounded-3xl border border-slate-200/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[22px] font-semibold text-[#111827] tracking-tight">{getGreeting()}, {user?.name}</h2>
          <p className="text-sm text-[#6B7280] font-medium mt-1">Welcome back to NutriLens. Track your nutrition, monitor your progress, and stay on top of your daily goals.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#4B5563] bg-white border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-sm select-none">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="flex flex-col gap-4 text-left">
        <h3 className="text-[18px] font-semibold text-[#111827]">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/predict" className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-blue-500 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-250">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-[#111827]">Analyze Meal</span>
                <span className="text-[10px] text-[#6B7280] font-medium">Scan new food photo</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link to="/bmi-calculator" className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-blue-500 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-250">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-[#111827]">BMI Calculator</span>
                <span className="text-[10px] text-[#6B7280] font-medium">Configure target calories</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link to="/reports" className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-blue-500 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-250">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-[#111827]">Reports</span>
                <span className="text-[10px] text-[#6B7280] font-medium">Download PDF / Excel</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link to="/profile" className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-blue-500 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-250">
                <Brain className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-[#111827]">Profile</span>
                <span className="text-[10px] text-[#6B7280] font-medium">Update settings</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* 2. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatisticsCard
          icon={<Activity className="w-5 h-5" />}
          title="Total Scans"
          value={analytics.statistics.total_predictions}
          subtitle="Meals scanned automatically"
        />
        <StatisticsCard
          icon={<Flame className="w-5 h-5" />}
          title="Average Calories"
          value={`${Math.round(analytics.statistics.average_calories)} kcal`}
          subtitle="Per scanned meal"
        />
        <StatisticsCard
          icon={<Award className="w-5 h-5" />}
          title="Average Accuracy"
          value={`${Math.round(analytics.statistics.average_confidence * 100)}%`}
          subtitle="Recognition match accuracy"
        />
        <StatisticsCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Highest Calorie Meal"
          value={analytics.statistics.highest_calorie_meal ? getFoodNameFromItem(analytics.statistics.highest_calorie_meal) : 'None'}
          subtitle={analytics.statistics.highest_calorie_meal ? `${analytics.statistics.highest_calorie_meal.calories} kcal` : '0 kcal'}
        />
        <Card className="flex flex-col justify-between p-6 hover:scale-[1.01] hover:shadow-md transition-all duration-300 border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_20px_-2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Daily Streak</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
              <Flame className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="mt-4 flex flex-col text-left">
            <span className="text-2xl font-bold text-[#111827]">
              {analytics.current_streak ?? 0} { (analytics.current_streak ?? 0) === 1 ? 'Day' : 'Days' }
            </span>
            <span className="text-xs text-[#6B7280] font-medium mt-1.5 leading-tight">Log one meal every day to grow your streak.</span>
            
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col gap-1.5 text-[10px] font-bold text-slate-500">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold uppercase">Best Streak</span>
                <span className="text-slate-700 font-extrabold">{analytics.longest_streak ?? 0} { (analytics.longest_streak ?? 0) === 1 ? 'Day' : 'Days' }</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold uppercase">Last Logged</span>
                <span className="text-slate-700 font-extrabold">{formatLastLoggedRelative(analytics.last_meal_logged_date)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Streak Ended Banner */}
      { (analytics.current_streak ?? 0) === 0 && analytics.last_meal_logged_date && (
        <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-left animate-fade-in -mt-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-amber-900">Your streak has ended.</span>
            <span className="text-xs text-amber-700 font-medium mt-0.5">Log a meal today to start a new one.</span>
          </div>
        </div>
      )}

      {/* 3 & 4. Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Trend */}
        <Card className="lg:col-span-2 flex flex-col gap-6 text-left">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Weekly Calories Trend</h3>
            <p className="text-xs text-[#6B7280] mt-1">Tracking daily calorie consumption dynamics</p>
          </div>
          <WeeklyTrendChart data={analytics.weekly_trend} />
        </Card>

        {/* Macronutrient Distribution */}
        <Card className="flex flex-col gap-6 text-left">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Macronutrient Ratio</h3>
            <p className="text-xs text-[#6B7280] mt-1">Ratio breakdown of scanned meal macros</p>
          </div>
          <MacronutrientChart data={analytics.macronutrients} />
        </Card>
      </div>

      {/* 5, 6 & 7. Top Foods, Activity & Summary Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Top Foods */}
        <Card className="flex flex-col gap-6">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-[#111827]">Top Scanned Foods</h3>
            <p className="text-xs text-[#6B7280] mt-1">Your most frequently scanned items</p>
          </div>
          <TopFoodsCard topFoods={analytics.top_foods} />
        </Card>

        {/* Recent Meal History */}
        <Card className="flex flex-col gap-6">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-[#111827]">Recent Meal History</h3>
            <p className="text-xs text-[#6B7280] mt-1">Realtime meal history logs</p>
          </div>
          <RecentActivityTimeline activities={analytics.recent_activity} />
        </Card>

        {/* Nutrition Summary Panel */}
        <SummaryPanel 
          averageCalories={analytics.statistics.average_calories}
          averageConfidence={analytics.statistics.average_confidence}
          highestCalorieMeal={analytics.statistics.highest_calorie_meal}
          lowestCalorieMeal={analytics.statistics.lowest_calorie_meal}
        />
      </div>

    </div>
  );
}
