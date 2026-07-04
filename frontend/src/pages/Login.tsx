import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/ui/Logo';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'NutriLens | Login';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      showToast('Logged in successfully!', 'success');
      navigate('/predict');
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.detail || 'Invalid email or password.';
      showToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-6 relative overflow-hidden font-sans text-[#4B5563] antialiased">
      {/* Decorative premium blue gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-md w-full z-10 flex flex-col gap-6">
        <Card className="p-8 backdrop-blur-md bg-white/90 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 text-left">
          
          {/* Logo and Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <Logo size={48} />
            <div className="flex flex-col gap-1 mt-2">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">NutriLens</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Sign in to continue your nutrition journey.</p>
            </div>
          </div>

          <div className="border-b border-slate-100 my-0.5"></div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email Input */}
            <div className="relative">
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="name@example.com"
                error={errors.email?.message}
                className="pl-10"
                {...register('email', { 
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <Mail className="absolute left-3.5 bottom-3 w-4 h-4 text-slate-400" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
                className="pl-10"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              <Lock className="absolute left-3.5 bottom-3 w-4 h-4 text-slate-400" />
            </div>

            {/* Action button */}
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-2 h-10 flex items-center justify-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="border-b border-slate-100"></div>

          {/* Footer Create account anchor */}
          <p className="text-center text-xs text-slate-505 font-semibold leading-none">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-bold transition-all">
              Register here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
