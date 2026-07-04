import React, { useState } from 'react';
import { nutritionService } from '../services/nutritionService';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { 
  Activity, 
  Flame, 
  Scale, 
  Info,
  ChevronRight,
  TrendingUp,
  User,
  Heart,
  Droplet
} from 'lucide-react';
import type { BMICalculatorResponse } from '../types';

export default function BmiCalculator() {
  const { showToast } = useToast();

  React.useEffect(() => {
    document.title = 'NutriLens | BMI Calculator';
  }, []);
  
  // Form input states
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BMICalculatorResponse | null>(null);
  const [errors, setErrors] = useState<{ age?: string; heightCm?: string; weightKg?: string }>({});

  const validate = () => {
    const newErrors: { age?: string; heightCm?: string; weightKg?: string } = {};
    
    // Age validation
    if (age === '') {
      newErrors.age = 'Age is required';
    } else if (age <= 0 || age > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }

    // Height validation
    if (heightCm === '') {
      newErrors.heightCm = 'Height is required';
    } else if (heightCm < 50 || heightCm > 300) {
      newErrors.heightCm = 'Height must be between 50 and 300 cm';
    }

    // Weight validation
    if (weightKg === '') {
      newErrors.weightKg = 'Weight is required';
    } else if (weightKg < 10 || weightKg > 500) {
      newErrors.weightKg = 'Weight must be between 10 and 500 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    try {
      const response = await nutritionService.calculateBMI({
        age: Number(age),
        gender,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        activity_level: activityLevel
      });
      setResult(response);
      showToast('Calculations updated successfully', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to calculate BMI and calories. Please check inputs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getBmiBadgeStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('underweight')) {
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
    if (cat.includes('normal')) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (cat.includes('overweight')) {
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
    return 'bg-red-50 text-red-700 border border-red-200'; // Obese
  };

  const getHealthTips = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('underweight')) {
      return [
        'Increase protein intake for healthy muscle development',
        'Eat nutrient-dense foods (nuts, seeds, eggs, olive oil)',
        'Strength training is recommended to build lean mass'
      ];
    }
    if (cat.includes('normal')) {
      return [
        'Great job maintaining a healthy BMI and body composition',
        'Continue balanced nutrition rich in whole foods and fiber',
        'Stay physically active with at least 150 minutes of weekly exercise'
      ];
    }
    if (cat.includes('overweight')) {
      return [
        'Reduce intake of refined sugar and processed foods',
        'Increase daily activity, including cardio and steps tracking',
        'Focus on portion control and mindful eating habits'
      ];
    }
    return [ // Obese
      'Consult a healthcare professional or dietitian for guidance',
      'Increase physical activity gradually to avoid joints strain',
      'Prioritize whole foods and hydration over liquid calories'
    ];
  };

  // Helper values for visual dashboard indicators
  const heightMeters = Number(heightCm) / 100;
  const minHealthyWeight = 18.5 * heightMeters * heightMeters;
  const maxHealthyWeight = 24.9 * heightMeters * heightMeters;
  const waterIntakeLiters = (Number(weightKg) * 35) / 1000;

  // Calculate cursor position for Visual BMI scale
  const minBmi = 15;
  const maxBmi = 40;
  const bmiVal = result ? result.bmi : 22;
  const bmiPosition = Math.max(0, Math.min(100, ((bmiVal - minBmi) / (maxBmi - minBmi)) * 100));

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in text-[#4B5563] max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="BMI & Calorie Calculator" 
        description="Calculate your body mass index and personalized daily calorie intake recommendation" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">
        {/* Left Column: Form Card */}
        <Card className="flex flex-col gap-6 text-left">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-[#111827]">Your Body Stats</h3>
          </div>

          <div className="border-t border-slate-200"></div>

          <form onSubmit={handleCalculate} className="flex flex-col gap-5">
            {/* Age input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#111827]" htmlFor="age-input">
                Age
              </label>
              <input
                id="age-input"
                type="number"
                disabled={loading}
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                  errors.age 
                    ? 'border-red-300 focus:border-red-450 focus:ring-red-100' 
                    : 'border-slate-200 focus:border-blue-500'
                }`}
                placeholder="e.g. 25"
              />
              {errors.age && (
                <span className="text-xs font-semibold text-red-500 mt-1">{errors.age}</span>
              )}
            </div>

            {/* Gender input */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[#111827]">
                Gender
              </span>
              <div className="flex items-center gap-6 mt-1 select-none">
                <label className="flex items-center gap-2 text-sm font-medium text-[#4B5563] cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    disabled={loading}
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-[#4B5563] cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    disabled={loading}
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            {/* Height input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#111827]" htmlFor="height-input">
                Height (cm)
              </label>
              <div className="relative mt-1">
                <input
                  id="height-input"
                  type="number"
                  disabled={loading}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                  className={`w-full pl-4 pr-12 py-2.5 rounded-xl border text-sm font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.heightCm 
                      ? 'border-red-300 focus:border-red-450 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                  placeholder="e.g. 175"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6B7280]">cm</span>
              </div>
              {errors.heightCm && (
                <span className="text-xs font-semibold text-red-500 mt-1">{errors.heightCm}</span>
              )}
            </div>

            {/* Weight input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#111827]" htmlFor="weight-input">
                Weight (kg)
              </label>
              <div className="relative mt-1">
                <input
                  id="weight-input"
                  type="number"
                  disabled={loading}
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                  className={`w-full pl-4 pr-12 py-2.5 rounded-xl border text-sm font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.weightKg 
                      ? 'border-red-300 focus:border-red-450 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                  placeholder="e.g. 70"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6B7280]">kg</span>
              </div>
              {errors.weightKg && (
                <span className="text-xs font-semibold text-red-500 mt-1">{errors.weightKg}</span>
              )}
            </div>

            {/* Activity Level selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#111827]" htmlFor="activity-input">
                Activity Level
              </label>
              <select
                id="activity-input"
                disabled={loading}
                value={activityLevel}
                onChange={(e: any) => setActivityLevel(e.target.value)}
                className="w-full px-4 py-2.5 mt-1 rounded-xl border border-slate-200 text-sm font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
              >
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="light">Lightly Active (Exercise 1-3 days/week)</option>
                <option value="moderate">Moderately Active (Exercise 3-5 days/week)</option>
                <option value="active">Active (Hard exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (Very hard exercise / physical job)</option>
              </select>
            </div>

            {/* Calculate Button */}
            <Button
              type="submit"
              size="lg"
              loading={loading}
              loadingText="Calculating..."
              className="w-full mt-4"
            >
              Calculate BMI
            </Button>
          </form>
        </Card>

        {/* Right Columns: Results & Dashboard Analytics */}
        <div className="lg:col-span-2 flex flex-col gap-8 w-full">
          {result ? (
            <div className="flex flex-col gap-8 w-full animate-fade-in">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* 1. BMI Card */}
                <Card className="flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Body Mass Index</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col items-start gap-1">
                    <span className="text-3xl font-extrabold text-[#111827] leading-none">{result.bmi.toFixed(2)}</span>
                    <span className={`text-xs font-bold uppercase px-2.5 py-1 mt-2.5 rounded-lg leading-relaxed ${getBmiBadgeStyle(result.bmi_category)}`}>
                      {result.bmi_category}
                    </span>
                  </div>
                </Card>

                {/* 2. Maintenance Calories Card */}
                <Card className="flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Maintenance Target</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <span className="text-2xl font-extrabold text-[#111827]">{result.maintenance_calories} kcal</span>
                    <span className="text-xs text-[#6B7280] mt-2.5 text-left leading-normal">Calories required to maintain weight</span>
                  </div>
                </Card>

                {/* 3. Weight Loss Calories Card */}
                <Card className="flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Weight Loss Target</span>
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <span className="text-2xl font-extrabold text-[#111827]">{result.weight_loss_calories} kcal</span>
                    <span className="text-xs text-[#6B7280] mt-2.5 text-left leading-normal">Target for gradual weight loss</span>
                  </div>
                </Card>

                {/* 4. Weight Gain Calories Card */}
                <Card className="flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Weight Gain Target</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <span className="text-2xl font-extrabold text-[#111827]">{result.weight_gain_calories} kcal</span>
                    <span className="text-xs text-[#6B7280] mt-2.5 text-left leading-normal">Target for healthy weight gain</span>
                  </div>
                </Card>

                {/* 5. Healthy Weight Range Card */}
                <Card className="flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Healthy Range</span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <span className="text-2xl font-extrabold text-[#111827]">{minHealthyWeight.toFixed(1)} - {maxHealthyWeight.toFixed(1)} kg</span>
                    <span className="text-xs text-[#6B7280] mt-2.5 text-left leading-normal">Ideal range for your height</span>
                  </div>
                </Card>

                {/* 6. Water Intake Target Card */}
                <Card className="flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Daily Hydration</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                      <Droplet className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <span className="text-2xl font-extrabold text-[#111827]">{waterIntakeLiters.toFixed(1)} Liters</span>
                    <span className="text-xs text-[#6B7280] mt-2.5 text-left leading-normal">Recommended daily water volume</span>
                  </div>
                </Card>
              </div>

              {/* Visual BMI Scale Slider Card */}
              <Card className="text-left flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-[#111827]">Visual BMI Spectrum</h3>
                </div>
                
                <div className="border-t border-slate-200"></div>
                
                <div className="py-2">
                  <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-red-400 mt-2">
                    <div 
                      className="absolute -top-1.5 w-6.5 h-6.5 rounded-full bg-white border-[3px] border-slate-800 shadow-md transform -translate-x-1/2 transition-all duration-1000"
                      style={{ left: `${bmiPosition}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bold text-[#6B7280] mt-4 select-none uppercase tracking-wider">
                    <span>Underweight (&lt;18.5)</span>
                    <span>Normal (18.5-25)</span>
                    <span>Overweight (25-30)</span>
                    <span>Obese (&gt;30)</span>
                  </div>
                </div>
              </Card>

              {/* Health Insights Tips Card */}
              <Card className="text-left flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-[#111827]">Personalized Health Insights</h3>
                </div>
                
                <div className="border-t border-slate-200"></div>

                <div className="flex flex-col gap-4">
                  {getHealthTips(result.bmi_category).map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm font-medium text-[#4B5563]">
                      <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            /* Empty State */
            <Card className="h-full flex flex-col items-center justify-center py-20 px-8 text-center text-[#6B7280] gap-4 bg-white/50 border border-dashed border-slate-200 rounded-3xl min-h-[400px]">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <Info className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex flex-col gap-2 max-w-sm">
                <h3 className="text-lg font-semibold text-[#111827]">No Calculations Yet</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mt-1">
                  Enter your age, gender, height, weight, and activity level and click Calculate to view your personalized BMI metrics, calorie targets, healthy weight ranges, and water intake recommendation.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
