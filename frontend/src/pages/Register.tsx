import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/ui/Logo';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export default function Register() {
  const { register: signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'NutriLens | Register';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password, data.role);
      showToast('Registration successful! Please log in.', 'success');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.detail || 'Registration failed. Try again.';
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

      <div className="max-w-md w-full z-10 flex flex-col gap-6 my-8">
        <Card className="p-8 backdrop-blur-md bg-white/90 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-5 text-left">
          
          {/* Logo and Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <Logo size={48} />
            <div className="flex flex-col gap-1 mt-2">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">NutriLens</h2>
              <p className="text-xs text-[#4B5563] font-semibold mt-1">Start your nutrition journey today</p>
            </div>
          </div>

          <div className="border-b border-slate-100 my-0.5"></div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div className="relative">
              <Input
                id="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                className="pl-10"
                {...register('name', { required: 'Full name is required' })}
              />
              <User className="absolute left-3.5 bottom-3 w-4 h-4 text-slate-400" />
            </div>

            {/* Email Address */}
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

            {/* Password */}
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

            {/* Role dropdown */}
            <Select
              id="role"
              label="Account Role"
              options={[
                { value: 'user', label: 'User (Standard Account)' },
                { value: 'admin', label: 'Admin (Administrator Tools)' }
              ]}
              {...register('role')}
            />

            {/* Action button */}
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-2 h-10 flex items-center justify-center gap-1.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="border-b border-slate-100"></div>

          {/* Footer Signin anchor */}
          <p className="text-center text-xs text-slate-505 font-semibold leading-none">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-bold transition-all">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
