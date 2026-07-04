import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Camera, Flame, Activity, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Shield, CalendarDays } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col font-sans text-slate-600">
      {/* 1. Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Brand Logo Group */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo size={36} className="transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold tracking-tight text-slate-900 leading-none">NutriLens</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-1 leading-none">Smart Nutrition Analytics Platform</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500">
            <a href="#features" className="transition-colors hover:text-blue-600">Features</a>
            <a href="#pipeline" className="transition-colors hover:text-blue-600">How it Works</a>
            <a href="#benefits" className="transition-colors hover:text-blue-600">Benefits</a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-4 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            {/* Interactive tag badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 p-1 pr-3 self-start shadow-sm">
              <span className="flex h-5 items-center justify-center rounded-full bg-blue-600 px-2 text-[9px] font-black uppercase tracking-wider text-white">New</span>
              <span className="text-[10px] font-bold text-slate-500 tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" /> Intelligent Meal Scanning
              </span>
            </div>

            {/* Core Header */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Analyze Your Meals.<br className="hidden sm:inline" />
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Understand Your Nutrition.</span>
            </h1>

            {/* Sub-text */}
            <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-lg">
              NutriLens helps you analyze meal photos and track nutrition through an intuitive analytics platform. Get instant portion scaling, calorie prediction, and detailed macronutrient breakdown integrated directly with our secure database.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                to="/register"
                className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-xs font-bold text-white shadow-sm hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 gap-2 cursor-pointer"
              >
                <span>Try Food Scan Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-xs font-bold text-slate-500 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Right Column: Preview Mock */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="w-full max-w-[460px] bg-white border border-slate-200 rounded-3xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
              {/* Application Top Bar Mock */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    NN
                  </div>
                  <span className="text-[10px] font-bold text-slate-900">NutriLens Analyzer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span className="text-[9px] text-slate-400 font-bold">Analysis Active</span>
                </div>
              </div>

              {/* Upload image area representation */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center gap-3 relative mb-4">
                {/* Simulated Bounding Box Overlay */}
                <div className="relative rounded-xl overflow-hidden max-h-36 w-full flex items-center justify-center border border-slate-150 bg-white">
                  <div className="absolute inset-0 border-2 border-blue-500/80 m-4 rounded-lg flex flex-col justify-between p-1.5">
                    <span className="bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded self-start shadow-sm leading-none">Noodles (98% Match)</span>
                  </div>
                  <div className="py-8 text-blue-600 flex flex-col items-center gap-1">
                    <Camera className="w-8 h-8 text-blue-600 opacity-80" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Meal Scanner</span>
                  </div>
                </div>
              </div>

              {/* Nutrition breakdown preview cards */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col gap-1 text-left">
                  <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Calories Estimated</span>
                  <span className="text-lg font-extrabold text-slate-900">380 kcal</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col gap-1 text-left">
                  <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Scale Weight</span>
                  <span className="text-lg font-extrabold text-slate-900">150 grams</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-3 flex justify-between items-center text-xs font-bold text-slate-500 mt-2">
                <span>Macronutrients:</span>
                <div className="flex gap-2 text-[10px]">
                  <span className="text-blue-500">C: 45g</span>
                  <span className="text-indigo-500">P: 12g</span>
                  <span className="text-slate-500">F: 8g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="bg-white border-y border-slate-200 py-16 px-6 lg:px-12 relative">
        <div className="mx-auto max-w-7xl flex flex-col gap-12">
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Application Capabilities</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Designed for Easy Tracking
            </h2>
            <p className="text-slate-500 text-xs font-semibold">
              Explore how we process visual food parameters into concrete macro breakdowns instantly.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-5 flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Intelligent Food Recognition</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Recognizes food items instantly from visual features using advanced algorithms.
                </p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-5 flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Calorie Estimation</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Determines calorie levels based on mapped food categories scaled to portion weights.
                </p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-5 flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Nutrition Analysis</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Retrieves proteins, fats, carbohydrates, and sugars relative to portion weights for daily logs monitoring.
                </p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-5 flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-655 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Meal History Logs</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Stores historical logs inside our secure database structure for user review, searching, and dashboard graphing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How it Works Workflow */}
      <section id="pipeline" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full relative">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Processing Pipeline</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              How NutriLens Works
            </h2>
            <p className="text-slate-500 text-xs font-semibold">
              The complete workflow transforming raw user images into parsed database logs.
            </p>
          </div>

          {/* Workflow Pipeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto w-full text-left">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">1</div>
              <h4 className="font-bold text-slate-900 text-xs uppercase">Photo Upload</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Select a meal image on your device and specify portion weight in grams.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">2</div>
              <h4 className="font-bold text-slate-900 text-xs uppercase">Recognition Scan</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">The application processes visual parameters to identify the food type.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">3</div>
              <h4 className="font-bold text-slate-900 text-xs uppercase">Macro Calculations</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Nutrition values (carbohydrates, proteins, fats) are calculated based on portion weights.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">4</div>
              <h4 className="font-bold text-slate-900 text-xs uppercase">Secure Log</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">The analyzed scan is logged under the user's ID, instantly updating dashboard activity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits Section */}
      <section id="benefits" className="bg-white border-t border-slate-200 py-16 px-6 lg:px-12 relative">
        <div className="mx-auto max-w-7xl flex flex-col gap-12">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Product Benefits</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Why Choose NutriLens
            </h2>
            <p className="text-slate-500 text-xs font-semibold">
              Get clean, intuitive insights that keep your nutrition goals on track.
            </p>
          </div>

          {/* Technology Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full text-left">
            <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Accurate Estimation</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Receive precise calorie and macronutrient breakdown calculations customized to portion weights.
              </p>
            </div>

            <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Structured Progression</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Audit historical records using filters, searches, and calendar trackers to observe weight and diet progress.
              </p>
            </div>

            <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-650 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Private & Secure</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Protect logs and profile information with secure authorization layers and encrypted credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white text-slate-550 py-8 px-6 lg:px-12 border-t border-slate-200 mt-auto text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-bold text-slate-900 text-sm">NutriLens</span>
          </div>
          <p className="text-slate-500">© 2026 NutriLens • Smart Nutrition Analytics Platform</p>
        </div>
      </footer>
    </div>
  );
}
