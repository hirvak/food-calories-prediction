import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import { useToast } from '../context/ToastContext';
import { getFoodNameFromItem } from '../utils/format';
import type { PredictFoodResult, TodayNutritionSummary, Prediction } from '../types';
import { 
  Upload, 
  Flame, 
  Egg, 
  Beef, 
  Wheat, 
  Cookie, 
  Camera, 
  Search,
  Clock,
  Inbox,
  Star,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Droplet,
  Leaf,
  Loader2,
  Compass
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

export default function PredictFood() {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<PredictFoodResult | null>(null);
  
  // Sidebar stats state
  const [todaySummary, setTodaySummary] = useState<TodayNutritionSummary | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      weight: 100,
    },
  });

  const fetchSidebarData = useCallback(async () => {
    try {
      const [summary, history] = await Promise.all([
        predictionService.getTodaySummary(),
        predictionService.getHistory(1, 3), // fetch latest 3 scans
      ]);
      setTodaySummary(summary);
      setRecentPredictions(history.predictions || []);
    } catch (error) {
      console.error('Failed to load sidebar statistics:', error);
    }
  }, []);

  useEffect(() => {
    document.title = 'NutriLens | Meal Analysis';
    fetchSidebarData();
  }, [fetchSidebarData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file', 'error');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Clear previous result
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      showToast('Please select a food image first', 'warning');
      return;
    }
    setIsPredicting(true);
    try {
      const prediction = await predictionService.predictFood(selectedFile, data.weight);
      setResult(prediction);
      if (prediction.message) {
        showToast(prediction.message, 'warning');
      } else {
        showToast('Food predicted successfully!', 'success');
      }
      // Refresh sidebar totals
      fetchSidebarData();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.detail || 'Failed to predict food.';
      showToast(errMsg, 'error');
    } finally {
      setIsPredicting(false);
    }
  };


  return (
    <div className="flex flex-col gap-5 max-w-7xl xl:max-w-[1400px] mx-auto w-full animate-fade-in pb-8 text-[#111827]">
      <PageHeader 
        title="Meal Analysis" 
        description="Upload a meal image to receive nutritional insights and detailed macro analysis." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column (Upload Card) */}
        <div className="md:col-span-1 xl:col-span-5 flex flex-col gap-6 w-full">
          {/* Upload Card */}
          <Card className="w-full text-left flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 text-left">
            <h3 className="text-lg font-semibold text-[#111827]">Scan Meal</h3>
            <p className="text-sm text-[#6B7280]">Upload an image of your food and provide the weight in grams.</p>
          </div>

          <div className="border-t border-slate-200"></div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Image selection Area */}
            <div className="flex flex-col gap-2 text-left">
              <label className="text-sm font-semibold text-[#111827]">Meal Photo</label>
              <div className="group relative border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 bg-slate-50/40 overflow-hidden flex flex-col items-center justify-center p-6 min-h-[160px] mt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {previewUrl ? (
                  <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                    <img 
                      src={previewUrl} 
                      alt="Upload food preview" 
                      className="max-h-32 rounded-xl object-cover shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-md"
                    />
                    <span className="text-xs text-[#6B7280] font-medium truncate max-w-[200px] mt-2 group-hover:text-blue-600 transition-colors">{selectedFile?.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400 py-3 text-center">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:text-blue-600 group-hover:border-blue-200">
                      <Upload className="w-4.5 h-4.5 text-[#6B7280] transition-colors group-hover:text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-blue-600 transition-colors">Select Food Photo</span>
                      <span className="text-xs text-[#6B7280] block mt-1 font-medium">Supports PNG, JPG, JPEG</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Weight Input */}
            <div className="flex flex-col gap-2 text-left">
              <label className="text-sm font-semibold text-[#111827]" htmlFor="weight">Portion Weight (Grams)</label>
              <div className="relative mt-1">
                <input
                  id="weight"
                  type="number"
                  step="any"
                  placeholder="100"
                  className={`w-full pl-4 pr-10 py-2.5 rounded-xl border text-sm font-medium text-[#111827] transition-all focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                    errors.weight 
                      ? 'border-red-300 focus:ring-red-100 focus:border-red-400' 
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                  {...register('weight', { 
                    required: 'Weight is required',
                    min: {
                      value: 1,
                      message: 'Weight must be at least 1 gram'
                    }
                  })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-nutrigo-textSecondary">g</span>
              </div>
              {errors.weight && (
                <span className="text-[10px] font-bold text-red-500 mt-1">{errors.weight.message}</span>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              size="lg"
              loading={isPredicting}
              loadingText="Analyzing..."
              className="w-full mt-4"
            >
              Analyze Meal
            </Button>
          </form>
        </Card>
      </div>

      {/* Center Column (Prediction Results Card) */}
      <div className="md:col-span-1 xl:col-span-4 flex flex-col gap-6 w-full">
        {isPredicting ? (
            /* Loading State Shimmer & Skeleton */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft flex flex-col gap-5 text-left animate-pulse">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-[10px] font-extrabold text-slate-700 tracking-wider uppercase">Analyzing your meal...</span>
              </div>
              
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <div className="h-full bg-blue-600 rounded-full absolute left-0 top-0 w-1/3 animate-bounce"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/80 h-16 rounded-2xl"></div>
                <div className="bg-slate-50/80 h-16 rounded-2xl"></div>
                <div className="bg-slate-50/80 h-16 rounded-2xl"></div>
                <div className="bg-slate-50/80 h-16 rounded-2xl"></div>
              </div>

              <div className="h-1.5 bg-slate-100 rounded-full w-24"></div>

              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-slate-50/80 h-14 rounded-2xl"></div>
                ))}
              </div>
            </div>
          ) : result ? (
            result.message ? (
              /* No Food Detected State */
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-soft flex flex-col gap-2.5 items-center text-center">
                <Search className="w-7 h-7 text-amber-500" />
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">No Food Detected</h4>
                <p className="text-[11px] text-amber-700 max-w-xs font-semibold">Our system could not identify food in this image. Try centering the meal and resizing portion weight.</p>
              </div>
            ) : (
              /* Success Result Card */
              <div className="flex flex-col gap-6 w-full text-left">
                {/* Prediction Success Badge */}
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-2xl font-bold text-xs shadow-sm animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" />
                  <span>✓ Nutrition Analysis Complete</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft flex flex-col gap-5">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nutrition Insights</span>
                    <h3 className="text-base font-extrabold text-slate-800 mt-0.5">{getFoodNameFromItem(result)}</h3>
                  </div>

                  <div className="border-t border-slate-100"></div>

                  {/* 4 Beautiful Metric Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Food Card */}
                    <div className="bg-slate-50/60 border border-slate-150 rounded-2xl p-3 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                        <Cookie className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] uppercase font-bold text-slate-400">Food Item</span>
                        <span className="text-xs font-extrabold text-slate-800 truncate">{getFoodNameFromItem(result)}</span>
                      </div>
                    </div>

                    {/* Confidence Card */}
                    <div className="bg-slate-50/60 border border-slate-150 rounded-2xl p-3 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-extrabold">
                        {Math.round(result.confidence * 100)}%
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] uppercase font-bold text-slate-400">Accuracy</span>
                        <span className="text-xs font-extrabold text-slate-800 whitespace-normal">Recognition Score
                        </span>                      
                      </div>
                    </div>

                    {/* Weight Card */}
                    <div className="bg-slate-50/60 border border-slate-150 rounded-2xl p-3 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-extrabold">
                        {result.weight}g
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] uppercase font-bold text-slate-400">Weight</span>
                        <span className="text-xs font-extrabold text-slate-800 truncate">Portion Scale</span>
                      </div>
                    </div>

                    {/* Calories Card */}
                    <div className="bg-slate-50/60 border border-slate-150 rounded-2xl p-3 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-extrabold">
                        {result.nutrition.calories}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] uppercase font-bold text-slate-400">Calories</span>
                        <span className="text-xs font-extrabold text-slate-800 truncate">Est. Energy</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100"></div>

                  {/* 6 Mini Nutrition Cards */}
                  <div className="flex flex-col gap-3">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nutrition Information</h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* Calories */}
                      <div className="p-3 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border border-blue-100/50 rounded-2xl flex flex-col items-start gap-1.5 transition-all hover:scale-[1.02] hover:shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                          <span className="text-[8px] uppercase font-bold text-slate-500">Calories</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 mt-0.5">{result.nutrition.calories} kcal</span>
                      </div>

                      {/* Protein */}
                      <div className="p-3 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border border-blue-100/50 rounded-2xl flex flex-col items-start gap-1.5 transition-all hover:scale-[1.02] hover:shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <Egg className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-[8px] uppercase font-bold text-slate-500">Protein</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 mt-0.5">{result.nutrition.protein} g</span>
                      </div>

                      {/* Fat */}
                      <div className="p-3 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border border-blue-100/50 rounded-2xl flex flex-col items-start gap-1.5 transition-all hover:scale-[1.02] hover:shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <Beef className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-[8px] uppercase font-bold text-slate-500">Fat</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 mt-0.5">{result.nutrition.fat} g</span>
                      </div>

                      {/* Carbohydrates */}
                      <div className="p-3 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border border-blue-100/50 rounded-2xl flex flex-col items-start gap-1.5 transition-all hover:scale-[1.02] hover:shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <Wheat className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[8px] uppercase font-bold text-slate-500">Carbohydrates</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 mt-0.5">{result.nutrition.carbohydrates} g</span>
                      </div>

                      {/* Fiber */}
                      <div className="p-3 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border border-blue-100/50 rounded-2xl flex flex-col items-start gap-1.5 transition-all hover:scale-[1.02] hover:shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[8px] uppercase font-bold text-slate-500">Fiber</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 mt-0.5">{result.nutrition.fiber} g</span>
                      </div>

                      {/* Sugar */}
                      <div className="p-3 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border border-blue-100/50 rounded-2xl flex flex-col items-start gap-1.5 transition-all hover:scale-[1.02] hover:shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <Cookie className="w-3.5 h-3.5 text-amber-700" />
                          <span className="text-[8px] uppercase font-bold text-slate-500">Sugar</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 mt-0.5">{result.nutrition.sugar} g</span>
                      </div>
                    </div>
                  </div>
                </div>

            </div>
          )
          ) : (
            /* Empty State Snapshot */
            <Card className="flex flex-col gap-6 items-center text-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm relative group hover:scale-105 transition-all duration-300">
                <Camera className="w-7 h-7 text-blue-600 transition-transform group-hover:rotate-12 duration-300" />
                <Sparkles className="w-4.5 h-4.5 text-blue-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              
              <div className="flex flex-col gap-1.5 max-w-sm">
                <h3 className="text-lg font-semibold text-[#111827]">Upload a food image</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mt-1">
                  Our system will detect your food, calculate nutrition, generate health insights, and recommend healthier alternatives.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-xs mt-3 text-xs font-semibold text-[#4B5563] bg-slate-50/50 p-4.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs flex-shrink-0 font-bold">1</span>
                  <span className="text-left">Select a food snapshot from your camera or files.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs flex-shrink-0 font-bold">2</span>
                  <span className="text-left">Type in the estimated meal weight.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs flex-shrink-0 font-bold">3</span>
                  <span className="text-left">Get comprehensive nutrition insights!</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column (Sidebar Statistics) */}
        <div className="md:col-span-2 xl:col-span-3 flex flex-col gap-6 w-full">
        {/* Today's Calories Goal Card */}
        <Card className="text-left flex flex-col gap-4">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Today's Intake Goal</span>
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-bold text-[#111827]">{todaySummary?.total_calories ?? 0}</h3>
              <span className="text-xs text-[#6B7280] font-medium">/ 2500 kcal</span>
            </div>
            <span className="text-xs font-bold text-blue-600">
              {Math.min(Math.round(((todaySummary?.total_calories ?? 0) / 2500) * 100), 100)}%
            </span>
          </div>

          {/* Simple progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(((todaySummary?.total_calories ?? 0) / 2500) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-[#4B5563] font-medium mt-4 pt-3 border-t border-slate-200">
            <span>Items Scanned:</span>
            <span className="text-[#111827] font-semibold">{todaySummary?.foods_consumed ?? 0} servings</span>
          </div>
        </Card>

        {/* Recent Scans list */}
        <Card className="text-left flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Recent Scans</h3>
            <p className="text-xs text-[#6B7280] mt-1">Your latest food scans</p>
          </div>

          <div className="border-b border-slate-200"></div>

          {recentPredictions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recentPredictions.map((item) => (
                <Link 
                  key={item.id} 
                  to="/history"
                  className="flex justify-between items-center bg-slate-50/40 hover:bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-200 transition-all duration-200 cursor-pointer hover:shadow-sm hover:translate-x-0.5"
                >
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-xs font-bold text-[#111827] truncate">{getFoodNameFromItem(item)}</span>
                    <span className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-sm">
                    {item.calories} kcal
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-[#6B7280] gap-1.5">
              <Inbox className="w-7 h-7 text-slate-300" />
              <p className="text-xs font-semibold text-[#6B7280]">No recent scans logged</p>
            </div>
          )}
        </Card>
      </div>
      </div>

      {/* Bottom Row: Nutrition Insights (full width) */}
      {result && (
        <div className="w-full mt-6 animate-fade-in-up">
          {/* AI Nutrition Insights Card */}
          {(() => {
            const coach = result.nutrition_coach || {
              score: 82,
              stars: 4,
              good_points: ["Good source of protein", "Balanced calorie intake"],
              warnings: ["High fat content", "Low fiber content"],
              recommendation: "Pair this meal with vegetables to improve fiber intake.",
              hydration_tip: "Drink 2–3 glasses of water after this meal."
            };
            
            const score = coach.score;
            const stars = coach.stars;

            return (
              <Card className="flex flex-col gap-4 text-left border border-slate-200 bg-white/80 backdrop-blur-md shadow-soft w-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Nutrition Insights</h4>
                  </div>
                  
                  {/* Score & Stars Display */}
                  <div className="flex items-center gap-4 text-right">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <div className="flex items-baseline gap-1 text-slate-800">
                      <span className="text-lg font-extrabold">{score}</span>
                      <span className="text-[10px] text-slate-450 font-bold">/100</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  {/* Left Column: Strengths & Recommendation */}
                  <div className="flex flex-col gap-4.5">
                    {/* Strengths */}
                    {coach.good_points && coach.good_points.length > 0 && (
                      <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-xl p-3.5 flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Strengths</span>
                        </span>
                        <ul className="flex flex-col gap-1.5 pl-1.5 text-xs text-slate-600 font-semibold text-left">
                          {coach.good_points.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendation */}
                    {coach.recommendation && (
                      <div className="bg-blue-50/20 border border-blue-100/50 rounded-xl p-3.5 flex flex-col gap-2 text-left">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
                          <span>Recommendation</span>
                        </span>
                        <p className="text-xs text-slate-655 font-semibold leading-relaxed pl-1.5">
                          {coach.recommendation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Things to Improve & Hydration Tip */}
                  <div className="flex flex-col gap-4.5">
                    {/* Things to Improve */}
                    {coach.warnings && coach.warnings.length > 0 && (
                      <div className="bg-amber-50/20 border border-amber-100/50 rounded-xl p-3.5 flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Things to Improve</span>
                        </span>
                        <ul className="flex flex-col gap-1.5 pl-1.5 text-xs text-slate-600 font-semibold text-left">
                          {coach.warnings.map((warn, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{warn}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Hydration Tip */}
                    {coach.hydration_tip && (
                      <div className="bg-sky-50/20 border border-sky-100/50 rounded-xl p-3.5 flex flex-col gap-2 text-left">
                        <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Droplet className="w-3.5 h-3.5 text-sky-500" />
                          <span>Hydration Tip</span>
                        </span>
                        <p className="text-xs text-slate-655 font-semibold leading-relaxed pl-1.5">
                          {coach.hydration_tip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })()}
        </div>
      )}
    </div>
  );
}
